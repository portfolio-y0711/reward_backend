import { IDatabase } from '@app/data'
import { IPlaceModel } from '@app/data/models/place'
import { IReviewModel } from '@app/data/models/review'
import { IUserModel } from '@app/data/models/user'
import { IReviewRewardModel } from '@app/data/models/user-review-reward'
import { IReviewPointEvent } from '@app/services/event/review/actions'
import { ReviewEventActionRouter } from '@app/services/event/review/actions'
import { mock } from 'jest-mock-extended'

describe('[Event] service => model', () => {
  let reviewEventActionHandler

  const eventInfo: IReviewPointEvent = {
    type: 'REVIEW',
    action: 'ADD',
    reviewId: '240a0658-dc5f-4878-9381-ebb7b2667772',
    content: '좋아요!',
    attachedPhotoIds: [
      'e4d1a64e-a531-46de-88d0-ff0ed70c0bb8',
      'afb0cef2-851d-4a50-bb07-9cc15cbdc332',
    ],
    userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
    placeId: '2e4baf1c-5acb-4efb-a1af-eddada31b00f',
  }

  describe.skip('when [POST: /api/events => controller.postEvent => service.handleEvent => handlers.handleReviewEvent]', () => {
    it(
      [
        'service.handleEvent =>',
        'reviewModel.findReviewCountsByPlaceId(✔︎)',
        'placeModel.findBonusPoint',
        'userModel.saveReviewPoint',
      ].join('\n\t '),
      () => {
        const spy = jest.fn()
        reviewEventActionHandler = ReviewEventActionRouter({
          getReviewModel: () => ({
            ...mock<IReviewModel>(),
            findReviewCountsByPlaceId: spy,
          }),
          getPlaceModel: () => mock<IPlaceModel>(),
          getUserModel: () => mock<IUserModel>(),
          getReviewRewardModel: () => mock<IReviewRewardModel>(),
          ...mock<IDatabase>(),
        })
        reviewEventActionHandler.route(eventInfo)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(eventInfo['placeId'])
      },
    )

    it(
      [
        'service.handleEvent =>',
        'reviewModel.findReviewCountsByPlaceId',
        'placeModel.findBonusPoint(✔︎)',
        'userModel.saveReviewPoint',
      ].join('\n\t '),
      () => {
        const spy = jest.fn()
        reviewEventActionHandler = ReviewEventActionRouter({
          getReviewModel: () => mock<IReviewModel>(),
          getPlaceModel: () => ({
            ...mock<IPlaceModel>(),
            findBonusPoint: spy,
          }),
          getUserModel: () => mock<IUserModel>(),
          getReviewRewardModel: () => mock<IReviewRewardModel>(),
          ...mock<IDatabase>(),
        })
        reviewEventActionHandler.route(eventInfo)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(eventInfo['placeId'])
      },
    )

    it(
      [
        'service.handleEvent =>',
        'reviewModel.findReviewCountsByPlaceId',
        'placeModel.findBonusPoint',
        'userModel.saveReviewPoint(✔︎)',
      ].join('\n\t '),
      () => {
        const spy = jest.fn()
        reviewEventActionHandler = ReviewEventActionRouter({
          getReviewModel: () => mock<IReviewModel>(),
          getPlaceModel: () => mock<IPlaceModel>(),
          getUserModel: () => ({
            ...mock<IUserModel>(),
            updateReviewPoint: spy,
          }),
          getReviewRewardModel: () => mock<IReviewRewardModel>(),
          ...mock<IDatabase>(),
        })
        reviewEventActionHandler.route(eventInfo)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(eventInfo['userId'], 2)
      },
    )
  })
})
