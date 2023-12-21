import { create } from "zustand";
import { TreeSchema } from "@/components/TreeCreateFlow/tree";
import { devtools, persist } from "zustand/middleware";

// Tree store

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

//  Group store - To save the drop down fields in the /campaign/{campaign_id} page

/*
interface GroupState {
  group1: string;
  group2: string;
  group3: string;
  setGroup1: (data: string) => void;
  setGroup2: (data: string) => void;
  setGroup3: (data: string) => void;
}

export const useGroupStore = create<GroupState>()(
  devtools(
    persist(
      (set) => ({
        group1: '',
        group2: '',
        group3: '',
        setGroup1: (data: string) => set((state) => ({...state, nodeName: data})),
        setGroup2: (data: string) => set((state) => ({...state, nodeType: data})),
        setGroup3: (data: string) => set((state) => ({...state, nodeWeight: data}))        
      }),
      { name: "groupStore" }
    )
  )
); */

