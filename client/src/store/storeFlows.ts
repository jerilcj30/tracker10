import { create } from "zustand";
import { TreeSchema } from "@/components/TreeCreateFlow/tree";
import { devtools, persist } from "zustand/middleware";

interface TreeState {
  savedTree?: TreeSchema;  
  saveTree: (data: TreeSchema) => void;  
}

export const useTreeStore = create<TreeState>()(
  devtools(
    persist(
      (set) => ({
        saveTree: (data: TreeSchema) => set((state) => ({ ...state, savedTree: data }))              
      }),
      { name: "treeStore" }
    )
  )
);

/*
interface FormState {
  nodeName: string;
  nodeType: string;
  nodeWeight: number;
  setNodeName: (data: string) => void;
  setNodeType: (data: string) => void;
  setNodeWeight: (data: number) => void;
}

export const useFormStore = create<FormState>()(
  devtools(
    persist(
      (set) => ({
        nodeName: '',
        nodeType: '',
        nodeWeight: 0,
        setNodeName: (data: string) => set((state) => ({...state, nodeName: data})),
        setNodeType: (data: string) => set((state) => ({...state, nodeType: data})),
        setNodeWeight: (data: number) => set((state) => ({...state, nodeWeight: data}))        
      }),
      { name: "nodeStore" }
    )
  )
);
*/