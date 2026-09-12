"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Position,
  type Edge,
  type Node,
} from "@xyflow/react";

import Link from "next/link";

type Person = {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  life_status?: string | null;
  date_of_birth?: string | null;
};

type Relationship = {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: "PARENT" | "SPOUSE";
};

type FamilyTreeProps = {
  people: Person[];
  relationships: Relationship[];
};

function getFullName(person: Person) {
  return [person.first_name, person.middle_name, person.last_name]
    .filter(Boolean)
    .join(" ");
}

function getInitial(person: Person) {
  return person.first_name?.charAt(0)?.toUpperCase() || "B";
}

function getStatus(status?: string | null) {
  if (status === "DECEASED") return "Deceased";
  if (status === "ALIVE") return "Alive";
  return "Unknown";
}

function createNodes(
  people: Person[],
  relationships: Relationship[]
): Node[] {
  const parentRelationships = relationships.filter(
    (relationship) => relationship.relationship_type === "PARENT"
  );

  const childrenByParent = new Map<string, string[]>();

  parentRelationships.forEach((relationship) => {
    const existing = childrenByParent.get(relationship.person_a_id) || [];

    existing.push(relationship.person_b_id);

    childrenByParent.set(relationship.person_a_id, existing);
  });

  /*
   * Calculate generations.
   *
   * A parent starts at generation 0.
   * Their children become generation 1,
   * grandchildren generation 2, etc.
   */
  const generation = new Map<string, number>();

  const childIds = new Set(
    parentRelationships.map((relationship) => relationship.person_b_id)
  );

  const roots = people.filter((person) => !childIds.has(person.id));

  function assignGeneration(personId: string, level: number) {
    const current = generation.get(personId);

    if (current !== undefined && current >= level) {
      return;
    }

    generation.set(personId, level);

    const children = childrenByParent.get(personId) || [];

    children.forEach((childId) => {
      assignGeneration(childId, level + 1);
    });
  }

  roots.forEach((person) => {
    assignGeneration(person.id, 0);
  });

  // People in disconnected components
  people.forEach((person) => {
    if (!generation.has(person.id)) {
      assignGeneration(person.id, 0);
    }
  });

  const levels = new Map<number, Person[]>();

  people.forEach((person) => {
    const level = generation.get(person.id) ?? 0;

    const existing = levels.get(level) || [];
    existing.push(person);

    levels.set(level, existing);
  });

  const nodes: Node[] = [];

  const horizontalGap = 280;
  const verticalGap = 210;

  Array.from(levels.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([level, members]) => {
      const totalWidth = (members.length - 1) * horizontalGap;

      members.forEach((person, index) => {
        const x = index * horizontalGap - totalWidth / 2;
        const y = level * verticalGap;

        nodes.push({
          id: person.id,
          position: {
            x,
            y,
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,

          data: {
            person,
          },

          style: {
            width: 220,
            borderRadius: 18,
            border: "1px solid #dfd5c8",
            background: "#fffdf8",
            boxShadow:
              "0 10px 25px rgba(61,42,30,0.08)",
            padding: 0,
          },
        });
      });
    });

  return nodes;
}

function createEdges(
  relationships: Relationship[]
): Edge[] {
  return relationships.map((relationship) => ({
    id: relationship.id,

    source: relationship.person_a_id,

    target: relationship.person_b_id,

    type:
      relationship.relationship_type === "SPOUSE"
        ? "straight"
        : "smoothstep",

    animated: false,

    style: {
      stroke:
        relationship.relationship_type === "SPOUSE"
          ? "#b08a45"
          : "#641f2b",

      strokeWidth:
        relationship.relationship_type === "SPOUSE"
          ? 2
          : 2.5,
    },

    label:
      relationship.relationship_type === "SPOUSE"
        ? "spouse"
        : undefined,

    labelStyle: {
      fill: "#746b63",
      fontSize: 11,
      fontFamily: "Arial",
    },

    labelBgStyle: {
      fill: "#f7f3eb",
      fillOpacity: 0.95,
    },
  }));
}

function PersonNode({ person }: { person: Person }) {
  return (
    <Link
      href={`/dashboard/family/${person.id}`}
      className="block h-full w-full"
    >
      <div className="h-full rounded-[18px] p-4 transition hover:bg-[#f7f3eb]">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#641f2b] font-serif text-lg text-white">
            {getInitial(person)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-serif text-base font-semibold text-[#321d1d]">
              {getFullName(person)}
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#b08a45]">
              {getStatus(person.life_status)}
            </p>
          </div>

        </div>

        {person.date_of_birth && (
          <p className="mt-3 border-t border-[#dfd5c8] pt-3 text-left text-xs text-[#746b63]">
            Born{" "}
            {new Date(person.date_of_birth).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
        )}

      </div>
    </Link>
  );
}

export default function FamilyTree({
  people,
  relationships,
}: FamilyTreeProps) {
  if (people.length === 0) {
    return (
      <div className="flex h-[650px] items-center justify-center rounded-3xl border border-[#dfd5c8] bg-[#fffdf8]">
        <div className="max-w-md px-6 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b08a45]/40 bg-[#b08a45]/10">
            <span className="font-serif text-3xl text-[#b08a45]">
              ✦
            </span>
          </div>

          <h2 className="mt-6 font-serif text-2xl text-[#321d1d]">
            The family tree is waiting
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#746b63]">
            Add family members and relationships to begin growing
            the Bandhul family tree.
          </p>

        </div>
      </div>
    );
  }

  const nodes = createNodes(people, relationships);
  const edges = createEdges(relationships);

  const nodeTypes = {
    person: PersonNode,
  };

  const nodesWithType = nodes.map((node) => ({
    ...node,
    type: "person",
  }));

  return (
    <div className="h-[700px] overflow-hidden rounded-3xl border border-[#dfd5c8] bg-[#f7f3eb] shadow-sm">

      <ReactFlow
        nodes={nodesWithType}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        minZoom={0.25}
        maxZoom={1.5}
        proOptions={{
          hideAttribution: true,
        }}
      >

        <Background
          gap={24}
          size={1}
          color="#dfd5c8"
        />

        <Controls
          position="bottom-left"
        />

        <MiniMap
          position="bottom-right"
          nodeColor="#641f2b"
          maskColor="rgba(247,243,235,0.75)"
        />

      </ReactFlow>
    </div>
  );
}