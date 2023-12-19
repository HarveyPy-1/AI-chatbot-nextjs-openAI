import { Metadata } from "next";

// Notice the folder where this page is contained, it has a layout.tsx, this enables the NavBar to only render on /notes or other links under /notes/other-links. You can do this for other components as well


export const metadata: Metadata = {
  title: "AI Notes | Notes",
};

const NotesPage = () => {
  return <div>These are your notes!</div>;
};
export default NotesPage;
