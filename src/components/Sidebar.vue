<template>
  <aside class="w-64 h-screen bg-white border-r flex flex-col">
    <!-- Logo -->
    <div class="border-b">
      <img
        :src="logo" 
        alt="GC Natural Elite Team Logo"
        class="w-[50%] h-auto object-contain drop-shadow-[0_0_12px_#C7A64F] ml-16"
      />
    </div>

    <!-- Navegación -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">

        <!-- ITEM -->
        <li>
          <RouterLink
            to="/admin"
            class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition group"
          >
            <HomeIcon class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            <span class="ml-3">Inicio</span>
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/admin/usuarios"
            class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition group"
          >
            <UsersIcon class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            <span class="ml-3">Alumnos</span>
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/admin/planes"
            class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition group"
          >
            <BookOpenIcon class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            <span class="ml-3">Planes</span>
          </RouterLink>
        </li>

      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t">
      <button
        class="flex items-center w-full p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition group"
      >
        <ArrowLeftOnRectangleIcon class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        <span class="ml-3">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from "vue-router"

// Importar iconos desde Heroicons (outline)
import {
  HomeIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  BookOpenIcon 
} from '@heroicons/vue/24/outline'
import logo from "@/assets/images/logo-gc.png";
</script>