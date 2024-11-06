import eventBus from "@/lib/event-bus";

const logout = async () => {
  eventBus.emit("logout");
};

export default logout;
