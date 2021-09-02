## 클럽 마일리지 서비스

> 포인트 적립 / 포인트 조회 REST API

<br/>

### API 데모

[![데모](http://img.youtube.com/vi/GX_3A7YiRZw/0.jpg)](https://www.youtube.com/watch?v=GX_3A7YiRZw?t=0s)

<br/>

**목차**

프로그램 작동법

구현 내용 (coverage of implementation)

데이터베이스 스키마 (database scheme)

설계상 주안점(design focus)

<br/>

### 1. 프로그램 작동법 

<br/>

🚀 &nbsp; **_macOS_** :   

_$ git clone https://github.com/portfolio-y0711/reward_backend_

_$ yarn (or npm install)_

_$ yarn start_

<br/>

☔ ️&nbsp; **_테스트 코드 실행_** :   

* 유닛 테스트: $ yarn u

* 통합 테스트: $ yarn i

* 시나리오 테스트: $ yarn i

<br/>

### 2. 구현 내용

<br/>

💻 &nbsp; **사용한 주요 언어 및 기술** :

* nodejs v14.15 (runtime)
* ts-node (transpiler)
* express (server application)  
* jest (test runner & framework)
* cucumber (test specification tools)
* supertest (server mocking test)
* yup (scheme validation)
* bunyan (as http request logger)
* winston (as applicaiton logger)
* swagger (api documentation)
* sqlite3 (database)

💻 &nbsp; **구현한 기능** :

* /events 리뷰 추가|변경|삭제 이벤트 처리 엔드포인트 

  - 트랜잭션 처리 

  - Context Error / Validation Error 처리 (리뷰 중복)

  - HTTP Request 로그 + Application 로그

* /users/{userId}/rewardPoint 사용자의 현재 포인트 총계

* /users/{userId}/rewards 사용자의 포인트 누적 이력

<br/>

### 3. 데이터베이스 스키마

<br/>

🏗 &nbsp; **_DDL Script_** :

```sql
# PLACES(장소)

CREATE TABLE IF NOT EXISTS 
    PLACES (
      placeId VARCHAR PRIMARY KEY, 
      country VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      bonusPoint INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS index_places_country ON PLACES(country);
CREATE INDEX IF NOT EXISTS index_places_name ON PLACES(name);
CREATE INDEX IF NOT EXISTS index_places_country_name ON PLACES(country,name);

# USERS(사용자)

CREATE TABLE IF NOT EXISTS 
    USERS (
      userId VARCHAR PRIMARY KEY, 
      name VARCHAR NOT NULL,
      rewardPoint INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    ) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS index_users_name ON users(name);

# REVIEWS(사용자 작성 리뷰)

CREATE TABLE IF NOT EXISTS 
    REVIEWS (
      reviewId VARCHAR PRIMARY KEY, 
      placeId INTEGER,
      content VARCHAR NOT NULL,
      attachedPhotoIds VARCHAR NOT NULL,
      userId INTEGER,
      rewarded INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

      CONSTRAINT fk_places
      FOREIGN KEY (placeId)
      REFERENCES PLACES (id)

      CONSTRAINT fk_users
      FOREIGN KEY (userId)
      REFERENCES USERS (id)
    ) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS index_reviews_rewarded ON REVIEWS(rewarded);

# REWARDS(포인트 적립 기록)

CREATE TABLE IF NOT EXISTS 
    REWARDS (
      rewardId VARCHAR PRIMARY KEY,
      userId VARCHAR, 
      reviewId VARCHAR,
      operation VARCHAR NOT NULL,
      pointDelta INTEGER NOT NULL,
      reason VARCHAR NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

      CONSTRAINT fk_users_rewards_users
      FOREIGN KEY (userId)
      REFERENCES USERS (id)

    ) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS index_rewards_reason ON REWARDS(reason);
```

### 4. 설계상 주안점, 워크플로우

<br/>

🎯 &nbsp; **_Open Closed Principle_** : 주요 구현부(포인트 적립 이벤트 서비스)에서, 라우팅 테이블 주입 및 라우팅 처리 (Event Router / Action Router)

<br/>

  **_⌘ 관련 코드_**

  _이벤트 핸들링 서비스_: [`src/services/event`](https://github.com/portfolio-y0711/reward_backend/tree/main/src/services/event)  


```ts
// 이벤트 타입으로 분기 ("REVIEW")
const EventRouter 
  = (routes: IEventRoutes): IEventRouteService => {
    const routeEvent = async (event: IEvent) => {
      appLogger.info(`[EVENT: EventRouter] received '${event.type}' |type| event => relay event to '${event.type}' event |action| router\n`)
      const { type } = event
      await routes[type](event)
    }
    return {
      routeEvent,
    }
  }

export const EventHandlerRoutes 
  = (context: { db: IEventDatabase }): IEventRoutes => {
    const { db } = context
    return {
      REVIEW: ReviewEventActionRouter(db).route,
      BLAR_BLAR: BlarBlarEventActionRouter(db).route,
    }
  }

// 액션 타입으로 분기 ("ADD", "MOD", "DELETE")
export const ComposeActionRoutes = (
  createActionRoutes: (db: IEventDatabase) => IReviewEventActionRoutes,
) => {
  return (db: IEventDatabase) => {
    const actionRoutes = createActionRoutes(db)
    const route = async (eventInfo: IReviewPointEvent) => {
      appLogger.info(`[EVENT: ReviewEventActionRouter] recevied '${eventInfo.action}' |action| event => relay event to '${eventInfo.action}' |action| handler\n`)
      await actionRoutes[eventInfo.action](eventInfo)
    }
    return {
      route,
    }
  }
}

export const reviewEventActionRoutes 
  = (db: IEventDatabase): IReviewEventActionRoutes => {
    return {
      "ADD": AddReviewActionHandler(db),
      "MOD": ModReviewActionHandler(db),
      "DELETE": DelReviewActionHandler(db),
    }
  }

```

<br/>

🎯 &nbsp; **_function composition (composition over inheritance)_** : function composition과 단방향 DI 주입을 통한 클린 아키텍처 구현

<br/>

🎯 &nbsp; **_BDD / TDD driven_** : 유닛 테스트 코드로 scaffolding 한 이후, 통합 테스트와 함께 구현체를 작성해 나가는 테스트 주도 개발 워크플로우 사용

<br/>

  **_⌘ 관련 코드_**

  _유닛 테스트_: [`tests/_unit`](https://github.com/portfolio-y0711/reward_backend/tree/main/tests/_unit)  

  _통합 테스트_: [`tests/_i11`](https://github.com/portfolio-y0711/reward_backend/tree/main/tests/_i11)  

  _시나리오 테스트_: [`tests/_usecase`](https://github.com/portfolio-y0711/reward_backend/tree/main/tests/_usecase)  

<br/>
