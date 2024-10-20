import { IMusiqRepository, MusiqRepository } from "@/modules/musiq";
import { IS3Repository, S3Repository } from "@/modules/S3";
import { IVideoService, VideoService } from "@/modules/video";
import {
  ClassConstructor,
  IocAdapter,
  useContainer,
} from "routing-controllers";
import { DependencyContainer, Lifecycle, container } from "tsyringe";

class TsyringeAdapter implements IocAdapter {
  constructor(private readonly TsyringeContainer: DependencyContainer) {}

  get<T>(someClass: ClassConstructor<T>): T {
    const childContainer = this.TsyringeContainer.createChildContainer();
    return childContainer.resolve<T>(someClass);
  }
}

// video domain dependencies
container.register<IVideoService>("VideoService", {
  useClass: VideoService,
});

// S3 domain dependencies
container.register<IS3Repository>("S3Repository", {
  useClass: S3Repository,
});

// musiq domain dependencies
container.register<IMusiqRepository>(
  "MusiqRepository",
  {
    useClass: MusiqRepository,
  },
  { lifecycle: Lifecycle.Singleton }
);

useContainer(new TsyringeAdapter(container));
