<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Access Denied</title>
    @vite('resources/js/apps.tsx')
</head>

<body style="
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 1rem;
">
    <div style="
        max-width: 400px;
        text-align: center;
    ">
        <h1 style="
            font-size: 5rem;
            font-weight: 800;
            color: #4f46e5;
            margin-bottom: 1rem;
            margin-top: 0;
        ">403</h1>
        <h2 style="
            font-size: 1.5rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
        ">Access Denied</h2>
        <p style="
            color: #6b7280;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        ">
            You do not have permission to view this page.
        </p>
        <a href="{{ url('/') }}" style="
                display: inline-block;
                background-color: #4f46e5;
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 0.375rem;
                text-decoration: none;
                font-weight: 500;
                transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#4338ca'" onmouseout="this.style.backgroundColor='#4f46e5'">
            Go back home
        </a>
    </div>
</body>

</html>