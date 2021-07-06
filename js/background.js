/**
 * Alrams 리스트 체크
 */
chrome.alarms.getAll(function (alrams) {
  console.log(alrams);
  for (var i = 0; i < alrams.length; i++) {
    $(`#${alrams[i].name}`).attr("checked", true);
  }
});

/**
 * 백그라운드 색상 변경
 */
$("button.search").on("click", () => {
  console.log("Turning Background red!");
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"',
  });

  chrome.tabs.executeScript({
    // chrome.tabs.executeScript(null, { file: "content.js" });
    code: `$('<td><input type="checkbox"></td>').appendTo('tr')`,
  });

  chrome.tabs.executeScript({
    code: "document.querySelector('#hdtb-msb-vis > div:nth-child(1) > a').click();",
  });
});

/**
 * 알람 상태 변경 이벤트
 */
$(".radio-alram").on("change", () => {
  soundManager.onready(() => {
    soundManager.createSound({
      id: "mySound",
      url: "/doorbell.wav",
    });
    soundManager.play("mySound");
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Got an alarm!", alarm);
  showNotification(alarm);
});

var showNotification = (data) => {
  var noti = {};
  switch (data.name) {
    case "weatherAlarm":
      let message = getWeather();
      if (message === "") return;
      noti.title = "Weather Alarm";
      noti.message = message;
      break;
    default:
      return;
  }
  chrome.notifications.create(
    data.name,
    {
      type: "basic",
      iconUrl: "icon.png",
      title: noti.title,
      message: noti.message,
    },
    (notificationId) => {
      chrome.notifications.clear(notificationId, () => {});
    }
  );
};