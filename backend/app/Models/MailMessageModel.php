<?php

declare(strict_types=1);

namespace App\Models;

final class MailMessageModel extends BaseModel
{
    /**
     * @param list<array<string, mixed>> $messages
     */
    public function upsertBatch(int $connectionId, array $messages): int
    {
        $insert = $this->db->prepare(
            'INSERT INTO mail_messages
                (connection_id, graph_message_id, subject, from_name, from_email, to_recipients,
                 body_preview, body_html, body_text, is_read, has_attachments, received_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                subject = VALUES(subject),
                from_name = VALUES(from_name),
                from_email = VALUES(from_email),
                to_recipients = VALUES(to_recipients),
                body_preview = VALUES(body_preview),
                body_html = VALUES(body_html),
                body_text = VALUES(body_text),
                is_read = VALUES(is_read),
                has_attachments = VALUES(has_attachments),
                received_at = VALUES(received_at),
                synced_at = NOW()'
        );

        $count = 0;
        foreach ($messages as $msg) {
            $insert->execute([
                $connectionId,
                $msg['graph_message_id'],
                $msg['subject'],
                $msg['from_name'],
                $msg['from_email'],
                $msg['to_recipients'],
                $msg['body_preview'],
                $msg['body_html'],
                $msg['body_text'],
                $msg['is_read'],
                $msg['has_attachments'],
                $msg['received_at'],
            ]);
            $count++;
        }

        return $count;
    }

    /** @return list<array<string, mixed>> */
    public function listForConnection(int $connectionId, int $limit, int $offset, string $search = ''): array
    {
        $sql = 'SELECT id, graph_message_id, subject, from_name, from_email, to_recipients,
                       body_preview, is_read, has_attachments, received_at, synced_at
                FROM mail_messages WHERE connection_id = ?';
        $params = [$connectionId];

        if ($search !== '') {
            $sql .= ' AND (subject LIKE ? OR from_name LIKE ? OR from_email LIKE ? OR body_preview LIKE ?)';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like, $like);
        }

        $sql .= ' ORDER BY received_at DESC LIMIT ' . (int) $limit . ' OFFSET ' . (int) $offset;

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll() ?: [];
    }

    public function findForConnection(int $messageId, int $connectionId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM mail_messages WHERE id = ? AND connection_id = ? LIMIT 1'
        );
        $stmt->execute([$messageId, $connectionId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
