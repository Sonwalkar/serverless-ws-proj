const showClientIdInHeader = (connectionId) => {
  /* The code is selecting all the `<li>` elements that are direct children of the `<ul>` element with
  the class "header". It then iterates over each selected element and removes it from the DOM. */
  const existingElement = document.querySelectorAll(".header ul > li");
  for (const el of existingElement) {
    el.remove();
  }

  const el = document.createElement("li");
  el.innerHTML = `<b>Your Id is: ${connectionId}`;
  document.querySelector("ul").appendChild(el);
};

/**
 * The function removes all inactive user div elements and the active user tab from the UI, and returns
 * the details of the removed active user tab.
 * @returns The function `removeAllUsersAndGroupFromUI` returns an object `activeUserTabDetails` which
 * contains the name and value of the active user tab that was removed from the DOM. If there is no
 * active user tab, it returns an empty object.
 */
const removeAllUsersAndGroupFromUI = () => {
  /* The code is selecting all the inactive user div elements within the ".window .userList" container
  and removing them from the DOM. */
  const inactiveDivs = document.querySelectorAll(
    ".window .userList > div.inactive"
  );
  for (const div of inactiveDivs) {
    div.remove();
  }

  const activeUserTab = document.querySelector(
    ".window .userList > div.active"
  );
  let activeUserTabDetails = "";

  if (activeUserTab) {
    activeUserTab.remove();
    activeUserTabDetails = {
      name: activeUserTab.innerText,
      value: activeUserTab.dataset.value,
    };
  }
  return activeUserTabDetails;
};

/**
 * The function `addUserOrGroupTab` creates a new div element with a specified class, text content, and
 * data attribute, and appends it to a specific element in the DOM.
 * @param userName - The `userName` parameter is a string that represents the name of the user or group
 * that will be displayed in the tab.
 * @param userId - The `userId` parameter is the unique identifier for the user or group. It is used to
 * associate the user or group with the corresponding tab in the user list.
 * @param tabStatus - The `tabStatus` parameter is a string that represents the status of the tab. It
 * could be used to apply different styles or classes to the created div element based on the status.
 */
const addUserOrGroupTab = (userName, userId, tabStatus) => {
  const div = document.createElement("div");
  div.className = tabStatus;
  div.innerText = userName;
  div.dataset.value = userId;
  document.querySelector(".window .userList").appendChild(div);
};

/**
 * The function "showUsersAndGroup" displays all users and groups, making them inactive except for the
 * activeUserTabDetails.
 * @param clients - An array of objects representing the clients connected to the server. Each object
 * has the following properties:
 * - socketId: The unique identifier for the client socket.
 * - clientName: The name of the client.
 * @param customRooms - An object that contains information about custom rooms. Each key represents a
 * room name, and the corresponding value is an array of socket IDs of the clients in that room.
 * @param activeUserTabDetails - activeUserTabDetails is an object that contains the details of the
 * currently active user tab. It has the following properties:
 * ! customRooms cannot be used right now as it is commented out.
 */
const showUsersAndGroup = (clients, activeUserTabDetails = "") => {
  // Show all the users and make them inactive except activeUserTabDetails.
  for (const client of clients) {
    let tabStatus = "inactive";

    if (activeUserTabDetails?.value === client.socketId) {
      tabStatus = "active";
    }

    addUserOrGroupTab(client.clientName, client.socketId, tabStatus);
  }

  // /**
  //  * Show all the groups and make them inactive except activeUserTabDetails.
  //  * Also checks if the current user is part of the group or not.
  //  */
  // for (const customRoom in customRooms) {
  //   if (!customRooms[customRoom].includes(socket.id)) {
  //     continue;
  //   }
  //   let tabStatus = "inactive";
  //   if (activeUserTabDetails.value === customRoom) {
  //     tabStatus = "active";
  //   }
  //   addUserOrGroupTab(customRoom, customRoom, tabStatus);
  // }
};

export {
  showClientIdInHeader,
  removeAllUsersAndGroupFromUI,
  showUsersAndGroup,
};
