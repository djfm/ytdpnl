# Configuration

- adjust the files `config.dist.yaml` and `docker-compose.dist.yaml` to your needs, remove the `.dist` suffix
- setup the virtual hosts defined in `docs`, customizing the domain names and ports if the defaults are not used
- enable SSL on the virtual hosts using let's encrypt
- put the correct urls in `config.extension.dist.ts` and remove the `.dist` suffix

# Development server

- `docker compose up -d`
- `yarn serve:dev`
