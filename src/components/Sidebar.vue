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

        <li>
          <button
            @click="openDropdown = !openDropdown"
            class="flex w-full items-center justify-between p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition"
          >
            <div class="flex items-center">
              <ClipboardDocumentIcon  class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              <span class="ml-3">Rutinas</span>
            </div>      
            
            <!-- Flecha -->
            <ChevronDownIcon
              class="w-5 h-5 text-gray-500 transition"
              :class="{ 'rotate-180': openDropdown }"
            />
          </button>

          <!-- Submenú -->
          <transition name="fade">
            <ul
              v-if="openDropdown"
              class="ml-10 mt-2 space-y-2 border-l pl-4 border-gray-200"
            >
              <li>
                <RouterLink
                  to="/admin/rutinas/comidas"
                  class="block p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Comidas
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/admin/rutinas/ejercicios"
                  class="block p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Ejercicios
                </RouterLink>
              </li>
            </ul>
          </transition>
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
import { ref } from "vue"
import { RouterLink } from "vue-router"

// Importar iconos desde Heroicons (outline)
import {
  HomeIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  BookOpenIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import logo from "@/assets/images/logo-gc.png";

const openDropdown = ref(false)
</script>