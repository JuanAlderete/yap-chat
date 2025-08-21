function ChatMenuItem({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-2 p-2 bg-sidebar hover:bg-[#E6D6CA] rounded-md cursor-pointer"
    >
      <div className="rounded-full bg-emerald-200 px-2 py-1">
        <div className="text-xs font-medium">Online</div>
      </div>
      <div className="flex-1 text-sm">
        <div className="font-medium">Chat {index + 1}</div>
        <div className="text-muted-foreground">
          <span className="font-medium">Online</span> for 10 minutes
        </div>
      </div>
    </div>
  );
}

export default ChatMenuItem;
