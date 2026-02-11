-- Initialize database schema

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    message TEXT NOT NULL,
    severity VARCHAR(10) NOT NULL DEFAULT 'INFO',
    source VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);
CREATE INDEX IF NOT EXISTS idx_logs_source ON logs(source);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp_severity ON logs(timestamp, severity);
CREATE INDEX IF NOT EXISTS idx_logs_source_timestamp ON logs(source, timestamp);

-- Insert sample data for development/demo
INSERT INTO logs (timestamp, message, severity, source) VALUES
    (NOW() - INTERVAL '7 days' + INTERVAL '1 hour', 'Application started successfully', 'INFO', 'api-gateway'),
    (NOW() - INTERVAL '7 days' + INTERVAL '2 hours', 'Connected to database', 'INFO', 'database-service'),
    (NOW() - INTERVAL '6 days', 'User authentication successful', 'INFO', 'auth-service'),
    (NOW() - INTERVAL '6 days' + INTERVAL '3 hours', 'Cache miss for key: user_123', 'DEBUG', 'cache-service'),
    (NOW() - INTERVAL '5 days', 'High memory usage detected: 85%', 'WARN', 'monitoring-service'),
    (NOW() - INTERVAL '5 days' + INTERVAL '4 hours', 'Failed to connect to external API', 'ERROR', 'api-gateway'),
    (NOW() - INTERVAL '4 days', 'Retrying connection attempt 1/3', 'WARN', 'api-gateway'),
    (NOW() - INTERVAL '4 days' + INTERVAL '1 hour', 'Connection restored', 'INFO', 'api-gateway'),
    (NOW() - INTERVAL '3 days', 'New user registration: user@example.com', 'INFO', 'auth-service'),
    (NOW() - INTERVAL '3 days' + INTERVAL '5 hours', 'Password reset requested', 'INFO', 'auth-service'),
    (NOW() - INTERVAL '2 days', 'Database backup completed successfully', 'INFO', 'database-service'),
    (NOW() - INTERVAL '2 days' + INTERVAL '2 hours', 'Slow query detected: 3.5s execution time', 'WARN', 'database-service'),
    (NOW() - INTERVAL '1 day', 'Payment processing successful', 'INFO', 'payment-service'),
    (NOW() - INTERVAL '1 day' + INTERVAL '6 hours', 'Invalid payment method attempted', 'ERROR', 'payment-service'),
    (NOW() - INTERVAL '12 hours', 'Scheduled task completed: cleanup_old_sessions', 'INFO', 'scheduler'),
    (NOW() - INTERVAL '6 hours', 'API rate limit exceeded for IP: 192.168.1.100', 'WARN', 'api-gateway'),
    (NOW() - INTERVAL '3 hours', 'SSL certificate will expire in 30 days', 'WARN', 'monitoring-service'),
    (NOW() - INTERVAL '2 hours', 'Healthcheck passed for all services', 'DEBUG', 'monitoring-service'),
    (NOW() - INTERVAL '1 hour', 'New deployment initiated: v1.2.3', 'INFO', 'deployment-service'),
    (NOW() - INTERVAL '30 minutes', 'Deployment completed successfully', 'INFO', 'deployment-service'),
    (NOW() - INTERVAL '15 minutes', 'Cache cleared: 1500 entries removed', 'DEBUG', 'cache-service'),
    (NOW() - INTERVAL '5 minutes', 'Active connections: 245', 'DEBUG', 'api-gateway'),
    (NOW(), 'System running normally', 'INFO', 'monitoring-service');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
