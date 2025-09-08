<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Taskly</title>

  <link rel="icon" type="image/png" href="{{ asset('images/task-logo.png') }}">

  <link rel="stylesheet" href="https://unpkg.com/@vercel/geist@latest/font.css">

  @viteReactRefresh
  @vite('resources/js/apps.tsx')
</head>

<body class="">
  <div id="root"></div>
</body>

</html>