import { Logger } from "@/libs";
import { PredictOptions } from "@/modules/musiq";
import { PythonShell } from "python-shell";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class MusiqRepository {
  private shell: PythonShell;

  constructor() {
    this.init();
  }

  private init() {
    this.shell = new PythonShell("model.py", {
      pythonOptions: ["-u"],
      scriptPath: "src/modules/musiq/scripts/",
    });

    this.shell.on("stderr", (error) => {
      Logger.error(error);
    });

    this.shell.on("close", () => {
      Logger.info("Restarting model shell...");
      this.init();
    });
  }

  predict(options: PredictOptions): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const stringifedOptions = JSON.stringify(options);
      this.shell.send(stringifedOptions);

      const onMessage = async (raw: string) => {
        try {
          console.log(raw);
          // const response = JSON.parse(raw);
          // console.log(response);
          // if ((response.buffer = options.buffer)) {
          //   resolve(response.prediction);
          //   this.shell.off("message", onMessage);
          // }
          resolve(0);
        } catch (err) {
          this.shell.off("message", onMessage);
          reject(err);
        }
      };

      this.shell.on("message", onMessage);
      this.shell.on("close", () => reject(new Error("Shell exception")));
    });
  }
}
