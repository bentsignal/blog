import * as Directory from "@/features/directory/atom";

const FolderView = ({ directory }: { directory: Directory.FolderType }) => {
  return (
    <Directory.Provider initialRoot={directory}>
      <Directory.Frame>
        <Directory.Header />
        <Directory.Body>
          <Directory.List />
        </Directory.Body>
      </Directory.Frame>
    </Directory.Provider>
  );
};

export { FolderView };
