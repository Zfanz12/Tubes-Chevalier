<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration successfully.
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'no_hp' => '081234567890',
            'role' => 'umkm'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'name',
                    'no_hp',
                    'role',
                    'created_at',
                    'updated_at'
                ],
                'otp_preview'
            ]);

        $this->assertDatabaseHas('users', [
            'no_hp' => '081234567890'
        ]);
    }

    /**
     * Test user validation fails during registration.
     */
    public function test_registration_validation_fails(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'no_hp' => '',
            'role' => 'invalid-role',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => [
                    'name',
                    'no_hp',
                    'role'
                ]
            ]);
    }

    /**
     * Test request OTP.
     */
    public function test_user_can_request_otp(): void
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'no_hp' => '08987654321',
            'role' => 'umkm'
        ]);

        $response = $this->postJson('/api/send-otp', [
            'no_hp' => '08987654321'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'no_hp',
                'otp_preview'
            ]);

        $this->assertNotNull($user->fresh()->otp_code);
    }

    /**
     * Test user login successfully via OTP.
     */
    public function test_user_can_login_via_otp(): void
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'no_hp' => '08987654321',
            'role' => 'umkm',
            'otp_code' => '123456',
            'otp_expires_at' => now()->addMinutes(5)
        ]);

        $response = $this->postJson('/api/login', [
            'no_hp' => '08987654321',
            'otp' => '123456'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
                'user'
            ]);
    }

    /**
     * Test user login with wrong OTP.
     */
    public function test_user_cannot_login_with_wrong_otp(): void
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'no_hp' => '08987654321',
            'role' => 'umkm',
            'otp_code' => '123456',
            'otp_expires_at' => now()->addMinutes(5)
        ]);

        $response = $this->postJson('/api/login', [
            'no_hp' => '08987654321',
            'otp' => '654321'
        ]);

        $response->assertStatus(401)
            ->assertJsonFragment([
                'message' => 'Kode OTP salah'
            ]);
    }

    /**
     * Test user logout successfully.
     */
    public function test_user_can_logout(): void
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'no_hp' => '08987654321',
            'role' => 'umkm'
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Logout berhasil'
            ]);
    }
}
