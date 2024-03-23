import {
  showClientIdInHeader,
  removeAllUsersAndGroupFromUI,
  showUsersAndGroup,
} from "./helper.js";

const socket = new WebSocket(
  "wss://ypu0hgxnxf.execute-api.us-east-1.amazonaws.com/dev"
);

// on connect show the socket id in the top bar.
socket.addEventListener("open", async (event) => {
  console.log("Connected to server");
  console.log("event: ", event);

  // const sendRequestObject = {
  //   reqType: "",
  //   message: "",
  //   to: "",
  // };

  let connectionId = "";
  let activeConnectionId = [];
  const activeUserTabDetails = "";
  socket.send(
    JSON.stringify({
      reqType: "getConnectionIds",
      message: "",
      to: "",
    })
  );

  socket.addEventListener("message", async (event) => {
    console.log("Message from server ", event);
    const body = JSON.parse(event.data);
    console.log("🚀 ~ socket.addEventListener ~ body:", body);
    switch (body.reqType) {
      case "getConnectionIds":
        connectionId = body.connectionId;
        activeConnectionId = body.activeConnectionId;

        showClientIdInHeader(connectionId);

        activeUserTabDetails = removeAllUsersAndGroupFromUI();

        showUsersAndGroup(activeConnectionId, activeUserTabDetails);
        break;
      case "getActiveConnectionId":
        console.log("getActiveConnectionId: ", body);
        break;
      case "sendMessage":
        console.log("sendMessage: ", body);
        if (
          document.querySelector(".window .userList .active").dataset.value ===
          body.from
        ) {
          if (body.from === connectionId) {
            const fromOtherDiv = document.createElement("div");
            fromOtherDiv.className = "fromYou";
            const div = document.createElement("div");
            div.innerText = body.message;
            fromOtherDiv.appendChild(div);
            document
              .querySelector(".window .chat .activeChat")
              .appendChild(fromOtherDiv);
          } else {
            const fromOtherDiv = document.createElement("div");
            fromOtherDiv.className = "fromOther";
            const div = document.createElement("div");
            div.innerText = body.message;
            fromOtherDiv.appendChild(div);
            document
              .querySelector(".window .chat .activeChat")
              .appendChild(fromOtherDiv);
          }
        }
        break;
      default:
        console.log("default: ", body);
        break;
    }
  });

  document
    .querySelector("#refreshConnections")
    .addEventListener("click", () => {
      socket.send(
        JSON.stringify({
          reqType: "getConnectionIds",
          message: "",
          to: "",
        })
      );
    });

  socket.addEventListener("close", (event) => {
    console.log("Message from server ", JSON.parse(event.data));
  });
});

// it selects client(socketId) to make active and inactive look
document.querySelector(".window .userList").addEventListener("click", (e) => {
  const activeDiv = document.querySelector(".window .userList .active");
  if (activeDiv) {
    activeDiv.classList.remove("active");
    activeDiv.classList.add("inactive");
  }
  e.target.classList.add("active");
  e.target.classList.remove("inactive");

  // const otherClientId = document.querySelector(".window .userList .active")
  //   .dataset.value;

  // socket.emit("activeRoomSwitch", socket.id, otherClientId); // ! paused for loading chat history
});

document.querySelector("#send").addEventListener("click", () => {
  const text = document.querySelector("#message").value;
  const room = document.querySelector(".window .userList .active").dataset
    .value;

  // add message to chat window as sender
  const fromOtherDiv = document.createElement("div");
  fromOtherDiv.className = "fromYou";
  const div = document.createElement("div");
  div.innerText = text;
  fromOtherDiv.appendChild(div);
  document.querySelector(".window .chat .activeChat").appendChild(fromOtherDiv);

  console.log("ele", document.querySelector(".window .userList .active"));
  console.log("room: ", room);

  socket.send(
    JSON.stringify({
      reqType: "sendMessage",
      message: text,
      to: room,
    })
  );
  document.querySelector("#message").value = "";
});

// On tab or window close disconnect the socket connection.
window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  socket.send(
    JSON.stringify({
      reqType: "disconnect",
    })
  );
  event.returnValue = "";
});

/**
 * on new connection list down all the clients connected to clients to servers.
 * Whenever a new client is connected to the server, the server emits the "clientList" event to all the clients connected to the server.
 */
socket.on("clientList", (clients, customRooms) => {
  // remove all users and groups from UI.
  const activeUserTabDetails = removeAllUsersAndGroupFromUI();

  // Show all the users and groups in UI.
  showUsersAndGroup(clients, customRooms, activeUserTabDetails);
});

socket.on("message", (text) => {
  console.log("message", text);

  if (
    document.querySelector(".window .userList .active").dataset.value ===
    text.socketId
  ) {
    if (text.socketId === socket.id) {
      const fromOtherDiv = document.createElement("div");
      fromOtherDiv.className = "fromYou";
      const div = document.createElement("div");
      div.innerText = text.message;
      fromOtherDiv.appendChild(div);
      document
        .querySelector(".window .chat .activeChat")
        .appendChild(fromOtherDiv);
    } else {
      const fromOtherDiv = document.createElement("div");
      fromOtherDiv.className = "fromOther";
      const div = document.createElement("div");
      div.innerText = text.message;
      fromOtherDiv.appendChild(div);
      document
        .querySelector(".window .chat .activeChat")
        .appendChild(fromOtherDiv);
    }
  } else if (
    document.querySelector(".window .userList .active").dataset.value ===
    text.room
  ) {
    if (text.socketId === socket.id) {
      const fromOtherDiv = document.createElement("div");
      fromOtherDiv.className = "fromYou";
      const div = document.createElement("div");
      div.innerText = text.message;
      fromOtherDiv.appendChild(div);
      document
        .querySelector(".window .chat .activeChat")
        .appendChild(fromOtherDiv);
    } else {
      const fromOtherDiv = document.createElement("div");
      fromOtherDiv.className = "fromOther";
      const div = document.createElement("div");
      div.innerText = text.message;
      fromOtherDiv.appendChild(div);
      document
        .querySelector(".window .chat .activeChat")
        .appendChild(fromOtherDiv);
    }
  }
});

socket.on("activeRoomChatOnSwitch", (chatHistory) => {
  console.log("chatHistory: ", chatHistory);

  const activeChatDiv = document.querySelector(".window .chat .activeChat");

  // remove all chat on click on tabs
  const tabsActiveChatDivs = document.querySelectorAll(
    ".window .chat .activeChat > div"
  );
  for (const div of tabsActiveChatDivs) {
    div.remove();
  }

  for (const chat of chatHistory) {
    if (chat.from === socket.id) {
      const fromOtherDiv = document.createElement("div");
      fromOtherDiv.className = "fromYou";
      const div = document.createElement("div");
      div.innerText = chat.message;
      fromOtherDiv.appendChild(div);
      activeChatDiv.appendChild(fromOtherDiv);
    } else {
      const fromOtherDiv = document.createElement("div");
      fromOtherDiv.className = "fromOther";
      const div = document.createElement("div");
      div.innerText = chat.message;
      fromOtherDiv.appendChild(div);
      activeChatDiv.appendChild(fromOtherDiv);
    }
  }
});

document.querySelector("#join").addEventListener("click", () => {
  const room = document.querySelector("#room").value;

  const newRoomDiv = document.createElement("div");
  newRoomDiv.className = "inactive";
  newRoomDiv.innerText = room;
  newRoomDiv.dataset.value = room;
  document.querySelector(".window .userList").appendChild(newRoomDiv);

  socket.emit("join-room", room);
});
