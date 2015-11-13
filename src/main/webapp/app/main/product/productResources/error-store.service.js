define([], function () {
  function ErrorStoreFactory() {
    return {
      messages: [],
      add: addMessage,
      display: displayMessage
    };

    function addMessage(errorMessage) {
      this.messages.push(errorMessage);
      if (this.messages.length > 100) {
        while (this.messages.length > 100) {
          this.messages.shift();
        }
      }
    }

    function displayMessage() {
      var displayedMessages = angular.copy(this.messages);
      while (this.messages.length > 0) {
        this.messages.pop();
      }
      return displayedMessages;
    }
  }

  return ErrorStoreFactory;
});
