import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import fs from 'fs-extra'

export default defineConfig({
  build: {
    target: 'modules',
    //打包文件目录
    outDir: 'es',
    //压缩
    minify: false,
    //css分离
    //cssCodeSplit: true,
    rollupOptions: {
      //忽略打包vue文件
      external: ['vue'],
      input: ['packages/index.ts'],
      output: [
        {
          format: 'es',
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: 'es',
          preserveModulesRoot: 'packages'
        }
      ]
    },
    lib: {
      entry: './packages/index.ts',
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      include: ['packages/**/*.ts', 'packages/**/*.tsx', 'packages/**/*.vue', 'types/**/*.d.ts'],
      outDir: 'es',
      staticImport: true,
      insertTypesEntry: true,
    }),
    // 复制types文件夹中的声明文件到es目录
    {
      name: 'copy-dts',
      closeBundle() {
        fs.copySync('types', 'es/types')
      }
    }
  ]
})
