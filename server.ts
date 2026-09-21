import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Разбор JSON полезной нагрузки
app.use(express.json({ limit: '1mb' }));

// ============================================================================
// 1. КОМПЛЕКСНЫЕ ЗАГОЛОВКИ БЕЗОПАСНОСТИ ДЛЯ ИНФОКИОСКОВ И ВЕБ-ПОРТАЛА
// ============================================================================
app.use((req, res, next) => {
  // Защита от Clickjacking / встраивания во внешние фреймы
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Защита от MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Защита от межсайтового скриптинга (XSS)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Политика передачи реферера (минимизация утечек путей)
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Аппаратная изоляция сенсорных терминалов: запрет доступа к сенсорам и медиа
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Политика безопасности контента (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; " +
    "img-src 'self' https: data: blob:; " +
    "connect-src 'self' https: wss:; " +
    "font-src 'self' https: data:; " +
    "frame-ancestors 'self';"
  );

  next();
});

// ============================================================================
// 2. СЕРВЕРНЫЙ RATE LIMITER (ЗАЩИТА ОТ БРУТФОРСА И СПАМА НА ТЕРМИНАЛАХ)
// ============================================================================
const clientRequestMap = new Map<string, { count: number; resetTime: number }>();

function createRateLimiter(limit: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawIp = req.headers['x-forwarded-for'];
    const ip = (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : req.socket.remoteAddress) || '127.0.0.1';
    const now = Date.now();

    const record = clientRequestMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    clientRequestMap.set(ip, record);

    if (record.count > limit) {
      return res.status(429).json({
        error: 'Превышен лимит запросов',
        message: 'Слишком много обращений к серверу. Пожалуйста, повторите позже.',
        retryAfterMs: record.resetTime - now,
      });
    }

    next();
  };
}

// ============================================================================
// 3. ЗАЩИЩЕННЫЕ СЕРВЕРНЫЕ API ЭНДПОИНТЫ
// ============================================================================

// Проверка работоспособности сервера и контура безопасности
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Корпоративный портал ОАО «Беллакт»',
    timestamp: new Date().toISOString(),
    securityHeaders: 'enforced',
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});

// Серверная регистрация событий безопасности (Audit Buffer)
const securityAuditBuffer: Array<{
  timestamp: string;
  ip: string;
  eventType: string;
  details: any;
}> = [];

app.post('/api/security/audit', createRateLimiter(30, 60 * 1000), (req, res) => {
  const { eventType, details } = req.body || {};
  const rawIp = req.headers['x-forwarded-for'];
  const ip = (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : req.socket.remoteAddress) || '127.0.0.1';

  if (!eventType || typeof eventType !== 'string') {
    return res.status(400).json({ error: 'Некорректный тип события' });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    eventType: eventType.substring(0, 50),
    details: typeof details === 'object' ? details : {},
  };

  securityAuditBuffer.push(logEntry);
  if (securityAuditBuffer.length > 500) {
    securityAuditBuffer.shift(); // Ротация буфера
  }

  res.json({ status: 'logged', id: securityAuditBuffer.length });
});

// Политика безопасности терминалов для валидации клиентами
app.get('/api/security/kiosk-policy', (req, res) => {
  res.json({
    kioskMode: true,
    defaultAutoLogoutMinutes: 5,
    allowedTimeoutOptions: ['2', '5', '10', 'never'],
    strictRlsEnforced: true,
    haccpRulesActive: true,
    version: '2.4.0-hardened',
  });
});

// ============================================================================
// 4. VITE И СТАТИЧЕСКАЯ РАЗДАЧА (DEVELOPMENT / PRODUCTION)
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер ОАО «Беллакт» запущен на http://0.0.0.0:${PORT} [NODE_ENV=${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('❌ Критический сбой при запуске сервера:', err);
  process.exit(1);
});
