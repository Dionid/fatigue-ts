import net from "net";

export const isPortReachable = async (
  host: string,
  port: number,
  timeout = 1000
) => {
  const promise = new Promise((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once("error", onError);
    socket.once("timeout", onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });

  try {
    await promise;

    return true;
  } catch {
    return false;
  }
};
