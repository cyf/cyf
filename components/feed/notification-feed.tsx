import { useState, useRef } from "react";
import {
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react-notification-feed";
import type { FeedItem } from "@knocklabs/client";

const NotificationFeed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  return (
    <>
      <NotificationIconButton
        ref={notifButtonRef}
        onClick={(e) => setIsVisible(!isVisible)}
      />
      <NotificationFeedPopover
        buttonRef={notifButtonRef}
        isVisible={isVisible}
        placement={"auto-end"}
        onClose={() => setIsVisible(false)}
        onNotificationClick={(item: FeedItem) => {}}
      />
    </>
  );
};

export default NotificationFeed;
