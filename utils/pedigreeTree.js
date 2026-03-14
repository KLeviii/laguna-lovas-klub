const COL_WIDTH = 280;
const ROW_GAP = 100;

/**
 * Build vue-flow nodes and edges from pedigree data
 * @param {{ root: Object, byId: Object }} pedigree
 * @returns {{ nodes: Array, edges: Array }}
 */
export function buildPedigreeGraph({ root, byId }) {
  const nodes = [];
  const edges = [];

  // First pass: calculate max depth
  const maxDepth = calcMaxDepth(root, byId, 0);

  // Build tree recursively; root is at column = maxDepth (rightmost)
  buildNode(root, byId, 0, maxDepth, nodes, edges, { yOffset: 0 });

  return { nodes, edges };
}

function calcMaxDepth(horse, byId, current) {
  if (!horse) return current;
  let depth = current;
  if (horse.sire_id && byId[horse.sire_id]) {
    depth = Math.max(depth, calcMaxDepth(byId[horse.sire_id], byId, current + 1));
  }
  if (horse.dam_id && byId[horse.dam_id]) {
    depth = Math.max(depth, calcMaxDepth(byId[horse.dam_id], byId, current + 1));
  }
  return depth;
}

/**
 * Recursively build nodes. Returns the y-center of this subtree.
 */
function buildNode(horse, byId, generation, maxDepth, nodes, edges, counter) {
  if (!horse) return counter.yOffset;

  const sire = horse.sire_id ? byId[horse.sire_id] : null;
  const dam = horse.dam_id ? byId[horse.dam_id] : null;

  let sireCenter = null;
  let damCenter = null;

  // Recurse into sire (top) then dam (bottom)
  if (sire) {
    sireCenter = buildNode(sire, byId, generation + 1, maxDepth, nodes, edges, counter);
  }
  if (dam) {
    damCenter = buildNode(dam, byId, generation + 1, maxDepth, nodes, edges, counter);
  }

  // Calculate y position
  let y;
  if (sireCenter !== null && damCenter !== null) {
    y = (sireCenter + damCenter) / 2;
  } else if (sireCenter !== null) {
    y = sireCenter;
  } else if (damCenter !== null) {
    y = damCenter;
  } else {
    // Leaf node — use next available y slot
    y = counter.yOffset;
    counter.yOffset += ROW_GAP;
  }

  const x = generation * COL_WIDTH;
  const role = getRoleName(generation, horse.gender);

  nodes.push({
    id: horse.id,
    type: "pedigreeNode",
    position: { x, y },
    data: {
      name: horse.name,
      gender: horse.gender,
      role,
      horseId: horse.id,
      isPedigreeOnly: horse.is_pedigree_only || false,
      hasSire: !!horse.sire_id,
      hasDam: !!horse.dam_id,
    },
  });

  // Edges from child → parent (left → right)
  if (sire) {
    edges.push({
      id: `e-${horse.id}-${sire.id}`,
      source: horse.id,
      target: sire.id,
      type: "smoothstep",
    });
  }
  if (dam) {
    edges.push({
      id: `e-${horse.id}-${dam.id}`,
      source: horse.id,
      target: dam.id,
      type: "smoothstep",
    });
  }

  return y;
}

function getRoleName(generation, gender) {
  if (generation === 0) return "";
  if (generation === 1) {
    return gender === "female" ? "Anyakanca" : "Fedeztetőmén";
  }
  const isFemale = gender === "female";
  if (generation === 2) {
    return isFemale ? "Nagyanya" : "Nagyapa";
  }
  if (generation === 3) {
    return isFemale ? "Dédnagyanya" : "Dédnagyapa";
  }
  const prefix = "Ük".repeat(generation - 3);
  return isFemale ? `${prefix}nagyanya` : `${prefix}nagyapa`;
}
