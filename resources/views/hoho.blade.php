<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Portfolio (Dark + Emerald)</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-black text-white font-sans">

    <!-- Navigation -->
    <nav class="w-full bg-[#111111] text-white p-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="text-xl font-bold text-white-400">My Portfolio</div>
        <div class="space-x-4">
          <a href="#projects" class="hover:text-emerald-400 transition">Projects</a>
          <a href="#contact" class="hover:text-emerald-400 transition">Contact</a>
          <a href="#" class="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700 transition">Hire Me</a>
        </div>
      </div>
    </nav>

    <!-- Portfolio Projects -->
    <main class="max-w-7xl mx-auto py-12 px-4" id="projects">
      <div class="grid md:grid-cols-3 gap-8">
        
        <!-- Project 1 -->
        <div class="bg-[#1a1a1a] p-6 rounded shadow-md hover:shadow-emerald-700 transition">
          <h2 class="text-xl font-bold mb-2 text-white-400">Portfolio Site</h2>
          <h3 class="text-gray-400 mb-4">Personal showcase site</h3>
          <img src="https://images.unsplash.com/photo-1581091012184-7c769207b738?auto=format&fit=crop&w=900&q=80" alt="Portfolio Screenshot" class="rounded mb-4 h-48 w-full object-cover" />
          <p class="mb-2">Minimal responsive site with all my work.</p>
          <p class="text-sm text-gray-400">Tools: HTML, CSS</p>
          <p class="text-sm text-gray-400">Year: 2025</p>
          <a href="#" class="text-white-400 mt-4 inline-block hover:underline">Visit Project</a>
        </div>

        <!-- Project 2 -->
        <div class="bg-[#1a1a1a] p-6 rounded shadow-md hover:shadow-emerald-700 transition">
          <h2 class="text-xl font-bold mb-2 text-white-400">Landing Page</h2>
          <h3 class="text-gray-400 mb-4">Modern product intro</h3>
          <img src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=900&q=80" alt="Landing Page Screenshot" class="rounded mb-4 h-48 w-full object-cover" />
          <p class="mb-2">Perfect for launches and SaaS intros.</p>
          <p class="text-sm text-gray-400">Tools: React, Tailwind</p>
          <p class="text-sm text-gray-400">Year: 2024</p>
          <a href="#" class="text-white-400 mt-4 inline-block hover:underline">Visit Project</a>
        </div>

        <!-- Project 3 -->
        <div class="bg-[#1a1a1a] p-6 rounded shadow-md hover:shadow-emerald-700 transition">
          <h2 class="text-xl font-bold mb-2 text-white-400">Blog Platform</h2>
          <h3 class="text-gray-400 mb-4">Built from scratch</h3>
          <img src="https://images.unsplash.com/photo-1523473827532-00a004e1c2ce?auto=format&fit=crop&w=900&q=80" alt="Blog Platform Screenshot" class="rounded mb-4 h-48 w-full object-cover" />
          <p class="mb-2">Markdown support, tags, and author profiles.</p>
          <p class="text-sm text-gray-400">Tools: Node.js, MongoDB</p>
          <p class="text-sm text-gray-400">Year: 2023</p>
          <a href="#" class="text-white-400 mt-4 inline-block hover:underline">Visit Project</a>
        </div>

      </div>
    </main>

    <!-- Contact Section -->
    <section id="contact" class="bg-[#111111] py-12">
      <div class="max-w-2xl mx-auto px-4">
        <h2 class="text-2xl font-bold mb-4 text-white-400">Stay in Touch</h2>
        <h3 class="text-gray-400 mb-6">Get updates or reach out for projects</h3>
        <form class="grid gap-4">
          <input type="text" placeholder="Your name" class="p-3 rounded bg-black text-white border border-gray-700" required />
          <input type="email" placeholder="Your email" class="p-3 rounded bg-black text-white border border-gray-700" required />
          <button type="submit" onclick="event.preventDefault()" class="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Subscribe</button>
        </form>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black text-center text-sm py-4">
      <p class="text-gray-600">© 2025 Your Name • <a href="#" class="text-emerald-400 hover:underline">GitHub</a></p>
    </footer>

  </body>
</html>
