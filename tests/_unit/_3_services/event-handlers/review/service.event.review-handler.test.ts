import { IDatabase } from '@app/data'
import { IPlaceModel } from '@app/data/models/place'
import { IReviewModel } from '@app/data/models/review'
import { IUserModel } from '@app/data/models/user'
import { IReviewRewardModel } from '@app/data/models/user-review-reward'
import { IReviewEventActionHandler } from '@app/services/event-handlers/review/action-handlers/handler.review-event'
import { IReviewPointEvent } from '@app/services/event-handlers/review/action-handlers/handler.review-event'
import { ReviewEventActionRouter } from '@app/services/event-handlers/review/action-handlers/handler.review-event'
import { mock } from 'jest-mock-extended'

describe('[Event] service => model', () => {
  // let reviewEventActionHandler: IReviewEventActionHandler
  let reviewEventActionHandler

  const eventInfo: IReviewPointEvent = {
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
    "content": "좋아요!",
    "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
    "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
    "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
  }

  describe.skip('when [POST: /api/events => controller.postEvent => service.handleEvent => handlers.handleReviewEvent]', () => {
    it([
        'service.handleEvent =>',
        'reviewModel.findReviewCountsByPlaceId(✔︎)',
        'placeModel.findBonusPoint',
        'userModel.saveReviewPoint'
      ].join('\n\t '), () => {

      const spy = jest.fn()
      reviewEventActionHandler = ReviewEventActionRouter({
        getReviewModel: () => ({
          ...mock<IReviewModel>(),
          findReviewCountsByPlaceId: spy
        }),
        getPlaceModel: () => mock<IPlaceModel>(),
        getUserModel: () => mock<IUserModel>(),
        getReviewRewardModel: () => mock<IReviewRewardModel>(),
        ...mock<IDatabase>()
      })
      reviewEventActionHandler.handleAction(eventInfo)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(eventInfo['placeId'])
    })

    it([
        'service.handleEvent =>',
        'reviewModel.findReviewCountsByPlaceId',
        'placeModel.findBonusPoint(✔︎)',
        'userModel.saveReviewPoint'
      ].join('\n\t '), () => {

      const spy = jest.fn()
      reviewEventActionHandler = ReviewEventActionRouter({
        getReviewModel: () => mock<IReviewModel>(),
        getPlaceModel: () => ({
          ...mock<IPlaceModel>(),
          findBonusPoint: spy 
        }),
        getUserModel: () => mock<IUserModel>(),
        getReviewRewardModel: () => mock<IReviewRewardModel>(),
        ...mock<IDatabase>()
      })
      reviewEventActionHandler.handleAction(eventInfo)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(eventInfo['placeId'])
    })
    

    it([
        'service.handleEvent =>',
        'reviewModel.findReviewCountsByPlaceId',
        'placeModel.findBonusPoint',
        'userModel.saveReviewPoint(✔︎)'
      ].join('\n\t '), () => {

      const spy = jest.fn()
      reviewEventActionHandler = ReviewEventActionRouter({
        getReviewModel: () => mock<IReviewModel>(),
        getPlaceModel: () => mock<IPlaceModel>(),
        getUserModel: () => ({
          ...mock<IUserModel>(),
          saveReviewPoint: spy
        }),
        getReviewRewardModel: () => mock<IReviewRewardModel>(),
        ...mock<IDatabase>()
      })
      reviewEventActionHandler.handleAction(eventInfo)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(eventInfo['userId'], 2)
    })

    // if (action == "ADD")
    //
    //  const reviewModel = fakeDatabase.getReviewModel()
    //  const isRewardable = reviewModel.isFirstReview(placeId)

    //  if (rewardable) 
    //
    //    const placeModel = fakeDatabase.getPlaceModel()
    //    const bonusPoint = placeModel.findBonusPoint(placeId)
    //    const totalPoint = ((content.length > 1) ? 1 : 0)  + ((attachedPhotoIds.length > 1) ? 1 : 0) + bonusPoint
    //
    //    const userModel = fakeDatabase.getUserModel()
    //    userModel.saveReviewPoint(placeId, userId, contentPoint, photoPoint, bonusPoint)
    //
    // else { do nothing }
    //
    // 
    

    // action이 ADD이면
    // 첫번째 리뷰인지 확인 (placeId로 Review 테이블을 조회하여 레코드가 없는지 확인)
    // => true이면 
    // 장소에 보너스 점수가 있는지 확인
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 점수 계산 후 유저 점수 부여
    // => false이면 리턴

    // if (action == "MOD")
    // 
    //

    // action이 MOD이면
    // 첫번째 리뷰인지 확인 (placeId와 reviewId로 Review 테이블을 조회하여 첫번째 레코드인지 확인)
    // => true이면 
    // 장소에 보너스 점수가 있는지 확인
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 유저 점수 timestamp(이력) 테이블에서 점수 부여된 내역을 확인
    //   => 유저 점수와 계산된 점수를 비교하여 점수 가감이 필요한 경우 관련 레코드 생성
    // => false이면 리턴

    // action이 DELETE이면
    // 첫번째 리뷰인지 확인 (placeId와 reviewId로 Review 테이블을 조회하여 첫번째 레코드인지 확인)
    // 장소에 보너스 점수가 있는지 확인
    // => true이면 
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 유저 점수 timestamp(이력) 테이블에서 점수 부여된 내역을 확인
    //   => 계산된 점수만큼 차감하는 레코드 생성
  })
})