import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {leadDashboardTool} from './leadDashboardTool'

export default defineConfig({
  name: 'default',
  title: 'Dr. Manu Gautam - Orthopedic Surgery',

  projectId: '3hwu79jd',
  dataset: 'production',

  plugins: [leadDashboardTool(), structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
