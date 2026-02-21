interface Env {
  ANTHROPIC_API_KEY: string;
  ACCESS_PASSWORDS: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const password = context.request.headers.get('x-access-password') || '';

  const validPasswords = context.env.ACCESS_PASSWORDS.split(',').map((p) => p.trim());
  if (!validPasswords.includes(password)) {
    return new Response(
      JSON.stringify({ error: { message: 'Senha invalida' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = await context.request.text();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': context.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
