import { Button } from "@/components/ui/button";
import { create } from "zustand";
import Login from "./pages/login";

type Store = {
  count: number;
  inc: () => void;
};

const useStore = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

function App() {
  return <Login />;
}

export default App;
