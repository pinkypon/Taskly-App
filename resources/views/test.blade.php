<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TaskManager App</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-white text-gray-800">

    <!-- Navbar -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600">TaskManager</h1>
        <div class="space-x-4">
          <a href="#" class="text-gray-700 hover:text-indigo-600">Home</a>
          <a href="#" class="text-gray-700 hover:text-indigo-600">Features</a>
          <a href="#" class="text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">Login</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
          Organize your day with TaskManager
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          The easiest way to track tasks, set priorities, and stay productive. Get started in seconds!
        </p>
        <a href="#" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded text-lg hover:bg-indigo-700 transition">
          Try It Free
        </a>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <h3 class="text-3xl font-bold mb-4">Why Choose TaskManager?</h3>
          <p class="text-gray-600">Designed for speed, clarity, and ease of use</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-6 rounded shadow hover:shadow-lg transition">
            <h4 class="text-xl font-semibold mb-2 text-indigo-600">Simple Interface</h4>
            <p class="text-gray-600">Manage your tasks without the clutter. Clear UI for maximum focus.</p>
          </div>
          <div class="bg-gray-50 p-6 rounded shadow hover:shadow-lg transition">
            <h4 class="text-xl font-semibold mb-2 text-indigo-600">Custom Priorities</h4>
            <p class="text-gray-600">Assign importance levels to keep high-value work front and center.</p>
          </div>
          <div class="bg-gray-50 p-6 rounded shadow hover:shadow-lg transition">
            <h4 class="text-xl font-semibold mb-2 text-indigo-600">Deadline Tracking</h4>
            <p class="text-gray-600">Never miss a task. Set due dates and see upcoming items at a glance.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call To Action -->
    <section class="bg-indigo-600 text-white py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h3 class="text-3xl font-bold mb-4">Ready to take control of your tasks?</h3>
        <p class="text-lg mb-6">Start using TaskManager now — it's fast, free, and always accessible.</p>
        <a href="#" class="inline-block bg-white text-indigo-600 px-6 py-3 rounded text-lg hover:bg-gray-100 transition">
          Get Started Free
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t py-6 text-center text-sm text-gray-500">
      &copy; 2025 TaskManager. All rights reserved.
    </footer>

  </body>
</html>
