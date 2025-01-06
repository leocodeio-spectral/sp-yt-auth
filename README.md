NestJs application for YT Api management of spectral


```bash
src/
  |_ config/
  |_ core/
  |_ utils/
    |_ health/
    |_ logging/
  |_ modules/
    |_ **creator**/
      |_ application/
        |_ dtos/
        |_ services/
      |_ domain/
        |_ ports/
        |_ enums/
        |_ models/
      |_ infrastructure/
        |_ adapters/
        |_ entities/
      |_ presentation/
        |_ controllers/
    |_ **contrib**/
  |_ common/
    |_ guard/
      |_ api/
      |_ auth/
      |_ jwt/
    |_ decorator/
      |_ api/
      |_ auth/
      |_ jwt/
    |_ exception/
      |_ filters/
      |_ application.excpetion.ts
      |_ domain.excpetion.ts
      |_ database.excpetion.ts
      |_ dependency.excpetion.ts
    |_ services/
    |_ interfaces/
```