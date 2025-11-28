<template>
    <div class="p-6 bg-white rounded-xl shadow">
        <!-- PROFILE HEADER -->
        <div class="flex items-center gap-4">
            <img
            :src="fotoUsuario"
            class="w-30 h-30 rounded-full object-cover"
            alt="Profile photo"
            />

            <div>
            <h2 class="text-2xl font-bold text-gray-900">Usuario Prueba Prueba</h2>
            <p class="text-gray-600">Última actividad: Hoy</p>
            </div>
        </div>

        <!-- NAV TABS -->
        <div class="mt-6 border-b">
            <nav class="flex gap-8 text-gray-700">
                <button class="py-3 cursor-pointer" :class="activeTab == 'datos' ? 'border-b-2 border-black font-medium' : ''" @click="activeTab = 'datos'">Datos Personales</button>
                <button class="py-3 hover:text-black cursor-pointer" :class="activeTab == 'medidas' ? 'border-b-2 border-black font-medium' : ''" @click="activeTab = 'medidas'">Medidas</button>
                <button class="py-3 hover:text-black cursor-pointer" :class="activeTab == 'rutinas' ? 'border-b-2 border-black font-medium' : ''" @click="activeTab = 'rutinas'">Rutinas</button>
                <button class="py-3 hover:text-black cursor-pointer" :class="activeTab == 'pagos' ? 'border-b-2 border-black font-medium' : ''" @click="activeTab = 'pagos'">Pagos</button>
                <button class="py-3 hover:text-black cursor-pointer" :class="activeTab == 'notas' ? 'border-b-2 border-black font-medium' : ''" @click="activeTab = 'notas'">Notas</button>
            </nav>
        </div>

        <!-- CONTENT -->
        <div class="grid grid-cols-2 gap-y-4 mt-6 text-gray-800" v-if="activeTab === 'datos'">

            <div class="font-medium text-gray-500">Calle</div>
            <div>Falsa 123</div>

            <div class="font-medium text-gray-500">Provincia</div>
            <div>Toledo</div>

            <div class="font-medium text-gray-500">Localidad</div>
            <div>Toledo</div>

            <div class="font-medium text-gray-500">Teléfono</div>
            <div>666 666 66</div>
        </div>

        <div class="grid grid-cols-2 gap-y-4 mt-6 text-gray-800" v-if="activeTab === 'medidas'">

            <div class="font-medium text-gray-500">Cintura</div>
            <div>110</div>

            <div class="font-medium text-gray-500">Cadera</div>
            <div>120</div>

            <div class="font-medium text-gray-500">Hombros</div>
            <div>140</div>

            <div class="font-medium text-gray-500">Pecho</div>
            <div>160</div>
        </div>

        <div class="grid grid-cols-2 gap-y-4 mt-6 text-gray-800" v-if="activeTab === 'rutinas'">

            <div class="font-medium text-gray-500">Por definir</div>
            <div>Por Definir</div>

        </div>

        <div class="grid grid-cols-2 gap-y-4 mt-6 text-gray-800" v-if="activeTab === 'pagos'">

            <div class="font-medium text-gray-500">Octubre 2025</div>
            <div><CheckCircleIcon class="w-5 h-5 text-green-900" /></div>

            <div class="font-medium text-gray-500">Noviembre 2025</div>
            <div><XCircleIcon class="w-5 h-5 text-red-900" /></div>
        </div>

        <div class="grid grid-cols-2 gap-y-4 mt-6 text-gray-800" v-if="activeTab === 'notas'">

            <div class="font-medium text-gray-500">11 Noviembre 2024</div>
            <div>No hace bien el Press Banca</div>

            <div class="font-medium text-gray-500">10 Abril 2025</div>
            <div>Está pasando por un momento de bajón, apoyarle más para que cumpla la rutina y así se despeje</div>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted } from "vue";
    import fotoUsuario from "@/assets/images/default.png";
    import {
        CheckCircleIcon,
        XCircleIcon
    } from '@heroicons/vue/24/outline'

    const activeTab = ref('datos')
</script>
