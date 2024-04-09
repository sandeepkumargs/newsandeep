import { useCallback } from "react";
import ReactFlow, {
  Connection,
  Controls,
  MarkerType,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "horizontal-1",
    sourcePosition: Position.Right,
    type: "input",
    data: { label: "Intern" },
    position: { x: 0, y: 150 },
    draggable: false,
  },
  {
    id: "horizontal-2",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Trainee" },
    position: { x: 250, y: 150 },
    draggable: false,
  },
  {
    id: "horizontal-3",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Associate" },
    position: { x: 500, y: 150 },
    draggable: false,
  },
  {
    id: "horizontal-4",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Engineer" },
    position: { x: 750, y: 150 },
    draggable: false,
  },
  {
    id: "horizontal-5",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Senior Engineer" },
    position: { x: 1000, y: 150 },
    draggable: false,
  },
  {
    id: "horizontal-6",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Lead Engineer" },
    position: { x: 1250, y: 150 },
    draggable: false,
  },
  {
    id: "m1",
    type: "output",
    data: { label: "People Management" },
    position: { x: 1550, y: -50 },
    style: { backgroundColor: "transparent", fontSize: 18, width: 650, height: 180 },
    draggable: false,
  },
  {
    id: "m2",
    type: "output",
    data: { label: "Technical Management" },
    position: { x: 1550, y: 150 },
    style: { backgroundColor: "transparent", fontSize: 18, width: 650, height: 180 },
    draggable: false,
  },
  {
    id: "horizontal-7",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Manager" },
    position: { x: 50, y: 80 },
    parentNode: "m1",
    draggable: false,
  },
  {
    id: "horizontal-8",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Principal" },
    position: { x: 50, y: 80 },
    parentNode: "m2",
    draggable: false,
  },
  {
    id: "horizontal-9",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Senior Manager" },
    position: { x: 250, y: 80 },
    parentNode: "m1",
    draggable: false,
  },
  {
    id: "horizontal-10",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Vice President" },
    position: { x: 250, y: 80 },
    parentNode: "m2",
    draggable: false,
  },
  {
    id: "horizontal-11",
    type: "output",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Portfolio Manager" },
    position: { x: 450, y: 80 },
    parentNode: "m1",
    draggable: false,
  },
  {
    id: "horizontal-12",
    type: "output",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Senior Vice President" },
    style: { width: "fit-content" },
    position: { x: 450, y: 80 },
    parentNode: "m2",
    draggable: false,
  },
];

const initialEdges = [
  {
    id: "e1",
    source: "horizontal-1",
    type: "smoothstep",
    target: "horizontal-2",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e2",
    source: "horizontal-2",
    type: "smoothstep",
    target: "horizontal-3",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e3",
    source: "horizontal-3",
    type: "smoothstep",
    target: "horizontal-4",
    // label: "edge label",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e4",
    source: "horizontal-4",
    type: "smoothstep",
    target: "horizontal-5",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e5",
    source: "horizontal-5",
    type: "smoothstep",
    target: "horizontal-6",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e6",
    source: "horizontal-6",
    target: "horizontal-7",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e7",
    source: "horizontal-6",
    target: "horizontal-8",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e8",
    source: "horizontal-7",
    target: "horizontal-9",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e9",
    source: "horizontal-8",
    target: "horizontal-10",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e10",
    source: "horizontal-9",
    target: "horizontal-11",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e11",
    source: "horizontal-10",
    target: "horizontal-12",
    animated: true,
    style: {
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const HorizontalFlow = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection) => setEdges((els) => addEdge(params, els)), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      proOptions={{ hideAttribution: true }}
    >
      <Controls />
    </ReactFlow>
  );
};

export default HorizontalFlow;
