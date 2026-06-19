<?php

declare(strict_types=1);

namespace App\Core;

final class HttpClient
{
    /**
     * @param list<string> $headers
     * @return array{status:int, body:string, json:?array}
     */
    public function request(string $method, string $url, array $headers = [], ?string $body = null, int $timeout = 45): array
    {
        $ch = curl_init($url);
        if ($ch === false) {
            throw new AppException('Unable to initialize HTTP client', 500);
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }

        $responseBody = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($responseBody === false) {
            throw new AppException('HTTP request failed: ' . $error, 502);
        }

        $json = json_decode($responseBody, true);
        return [
            'status' => $status,
            'body' => $responseBody,
            'json' => is_array($json) ? $json : null,
        ];
    }

    /**
     * @param list<string> $headers
     * @return array<string, mixed>
     */
    public function requestJson(string $method, string $url, array $headers = [], ?string $body = null): array
    {
        $result = $this->request($method, $url, $headers, $body);

        if ($result['status'] >= 400) {
            $msg = $this->extractErrorMessage($result['json'], $result['status']);
            throw new AppException($msg, $result['status'] >= 500 ? 502 : $result['status']);
        }

        return $result['json'] ?? [];
    }

    /** @param ?array<string, mixed> $json */
    private function extractErrorMessage(?array $json, int $status): string
    {
        if (!is_array($json)) {
            return 'HTTP ' . $status;
        }

        if (!empty($json['error_description']) && is_string($json['error_description'])) {
            return $json['error_description'];
        }

        if (!empty($json['error']['message']) && is_string($json['error']['message'])) {
            return $json['error']['message'];
        }

        if (!empty($json['error']) && is_string($json['error'])) {
            return $json['error'];
        }

        return 'HTTP ' . $status;
    }
}
