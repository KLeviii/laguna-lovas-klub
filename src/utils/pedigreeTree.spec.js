import { describe, it, expect } from 'vitest'
import { buildPedigreeGraph } from './pedigreeTree'

function makeHorse(id, name, gender, sireId = null, damId = null) {
  return { id, name, gender, sire_id: sireId, dam_id: damId }
}

describe('buildPedigreeGraph', () => {
  it('builds a single root node with no ancestors', () => {
    const root = makeHorse('1', 'Bucephalus', 'male')
    const byId = { '1': root }

    const { nodes, edges } = buildPedigreeGraph({ root, byId })

    expect(nodes).toHaveLength(1)
    expect(nodes[0].id).toBe('1')
    expect(nodes[0].data.name).toBe('Bucephalus')
    expect(edges).toHaveLength(0)
  })

  it('builds a tree with sire and dam', () => {
    const root = makeHorse('1', 'Foal', 'male', '2', '3')
    const sire = makeHorse('2', 'Sire', 'male')
    const dam = makeHorse('3', 'Dam', 'female')
    const byId = { '1': root, '2': sire, '3': dam }

    const { nodes, edges } = buildPedigreeGraph({ root, byId })

    expect(nodes).toHaveLength(3)
    expect(edges).toHaveLength(2)

    const edgeSources = edges.map(e => e.source)
    expect(edgeSources).toContain('2')
    expect(edgeSources).toContain('3')
  })

  it('builds a three-generation tree', () => {
    const grandSire = makeHorse('4', 'GrandSire', 'male')
    const grandDam = makeHorse('5', 'GrandDam', 'female')
    const sire = makeHorse('2', 'Sire', 'male', '4', '5')
    const dam = makeHorse('3', 'Dam', 'female')
    const root = makeHorse('1', 'Foal', 'male', '2', '3')
    const byId = { '1': root, '2': sire, '3': dam, '4': grandSire, '5': grandDam }

    const { nodes, edges } = buildPedigreeGraph({ root, byId })

    expect(nodes).toHaveLength(5)
    expect(edges).toHaveLength(4)
  })

  it('handles missing ancestors gracefully', () => {
    const root = makeHorse('1', 'Foal', 'male', '2', '3')
    const sire = makeHorse('2', 'Sire', 'male')
    // dam '3' is referenced but not in byId
    const byId = { '1': root, '2': sire }

    const { nodes, edges } = buildPedigreeGraph({ root, byId })

    expect(nodes).toHaveLength(2)
    expect(edges).toHaveLength(1)
  })

  it('assigns correct role names for generations', () => {
    const sire = makeHorse('2', 'Sire', 'male')
    const dam = makeHorse('3', 'Dam', 'female')
    const root = makeHorse('1', 'Foal', 'male', '2', '3')
    const byId = { '1': root, '2': sire, '3': dam }

    const { nodes } = buildPedigreeGraph({ root, byId })

    const rootNode = nodes.find(n => n.id === '1')
    const sireNode = nodes.find(n => n.id === '2')
    const damNode = nodes.find(n => n.id === '3')

    expect(rootNode.data.role).toBe('')
    expect(sireNode.data.role).toBe('Fedeztetőmén')
    expect(damNode.data.role).toBe('Anyakanca')
  })

  it('positions nodes with correct x coordinates based on generation', () => {
    const sire = makeHorse('2', 'Sire', 'male')
    const root = makeHorse('1', 'Foal', 'male', '2', null)
    const byId = { '1': root, '2': sire }

    const { nodes } = buildPedigreeGraph({ root, byId })

    const rootNode = nodes.find(n => n.id === '1')
    const sireNode = nodes.find(n => n.id === '2')

    // Root should be at higher x than sire (rightmost)
    expect(rootNode.position.x).toBeGreaterThan(sireNode.position.x)
  })
})
