export type InputState = {
  left: boolean;
  right: boolean;
  shoot: boolean;
  startPressed: boolean;
};

export function createInputState(): InputState {
  return {
    left: false,
    right: false,
    shoot: false,
    startPressed: false,
  };
}

export function consumeStartPress(input: InputState) {
  input.startPressed = false;
}

function isLeftKey(code: string) {
  return code === "ArrowLeft" || code === "KeyA";
}

function isRightKey(code: string) {
  return code === "ArrowRight" || code === "KeyD";
}

function isShootKey(code: string) {
  return code === "Space";
}

export function attachKeyboardListeners(input: InputState) {
  const onKeyDown = (event: KeyboardEvent) => {
    if (isLeftKey(event.code)) {
      input.left = true;
      event.preventDefault();
    }

    if (isRightKey(event.code)) {
      input.right = true;
      event.preventDefault();
    }

    if (isShootKey(event.code)) {
      if (!event.repeat) {
        input.startPressed = true;
      }

      input.shoot = true;
      event.preventDefault();
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (isLeftKey(event.code)) {
      input.left = false;
      event.preventDefault();
    }

    if (isRightKey(event.code)) {
      input.right = false;
      event.preventDefault();
    }

    if (isShootKey(event.code)) {
      input.shoot = false;
      event.preventDefault();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}
