import * as React from 'react';

interface EmailTemplateProps {
  walletAddress: string;
  share: string;
}

export function EmailTemplate({ walletAddress, share }: EmailTemplateProps) {
  return (
    <div
      style={{
        backgroundColor: '#f4f4f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '40px 16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          maxWidth: '560px',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3d1dff 0%, #6b3dff 100%)',
            padding: '32px 40px',
            textAlign: 'center' as const,
          }}
        >
          <p
            style={{
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              margin: 0,
            }}
          >
            Jumper Wallet
          </p>
          <p style={{ color: '#c4b5fd', fontSize: '13px', margin: '4px 0 0' }}>
            Recovery Backup
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '36px 40px' }}>
          <h1
            style={{
              color: '#18181b',
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 12px',
            }}
          >
            Your recovery share is here
          </h1>
          <p
            style={{
              color: '#52525b',
              fontSize: '15px',
              lineHeight: 1.6,
              margin: '0 0 28px',
            }}
          >
            This email contains one of your wallet recovery shares. Keep it safe
            — you will need it to restore access to your wallet if you lose your
            device or password.
          </p>

          {/* Wallet address */}
          <p
            style={{
              color: '#71717a',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              margin: '0 0 6px',
              textTransform: 'uppercase' as const,
            }}
          >
            Wallet address
          </p>
          <div
            style={{
              backgroundColor: '#f4f4f5',
              borderRadius: '8px',
              fontFamily: '"Menlo", "Consolas", "Courier New", monospace',
              fontSize: '13px',
              color: '#3f3f46',
              padding: '12px 16px',
              marginBottom: '28px',
              wordBreak: 'break-all' as const,
            }}
          >
            {walletAddress}
          </div>

          {/* Recovery share */}
          <p
            style={{
              color: '#71717a',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              margin: '0 0 6px',
              textTransform: 'uppercase' as const,
            }}
          >
            Recovery share
          </p>
          <div
            style={{
              backgroundColor: '#fdf4ff',
              border: '1px solid #e9d5ff',
              borderRadius: '8px',
              fontFamily: '"Menlo", "Consolas", "Courier New", monospace',
              fontSize: '12px',
              color: '#6b21a8',
              padding: '16px',
              marginBottom: '28px',
              wordBreak: 'break-all' as const,
              lineHeight: 1.7,
            }}
          >
            {share}
          </div>

          {/* How to use */}
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '28px',
            }}
          >
            <p
              style={{
                color: '#15803d',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 8px',
              }}
            >
              How to recover your wallet
            </p>
            <ol
              style={{
                color: '#166534',
                fontSize: '13px',
                lineHeight: 1.7,
                margin: 0,
                paddingLeft: '18px',
              }}
            >
              <li>
                Open Jumper and click <strong>Restore wallet</strong>.
              </li>
              <li>
                Choose <strong>Recover from email share</strong>.
              </li>
              <li>
                Copy and paste the recovery share above into the input field.
              </li>
              <li>Complete any additional verification steps.</li>
            </ol>
          </div>

          {/* Security warning */}
          <div
            style={{
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <p
              style={{
                color: '#c2410c',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 4px',
              }}
            >
              Security notice
            </p>
            <p
              style={{
                color: '#9a3412',
                fontSize: '13px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Never share this email or its contents with anyone. Jumper support
              will <strong>never</strong> ask you for your recovery share. If
              you did not request this email, contact our support immediately.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #f4f4f5',
            padding: '24px 40px',
            textAlign: 'center' as const,
          }}
        >
          <p
            style={{
              color: '#a1a1aa',
              fontSize: '12px',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            This is an automated message from Jumper Wallet.
            <br />© {new Date().getFullYear()} Jumper Exchange. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
