import * as yup from 'yup'
import { EVENT_TYPE } from '@app/typings'
import { REVIEW_ACTION } from '@app/services/event/review/actions'

export default yup.object().shape({
  type: yup.mixed<EVENT_TYPE>().oneOf(['REVIEW', 'BLAR_BLAR']),
  action: yup.mixed<REVIEW_ACTION>().oneOf(['ADD', 'MOD', 'DELETE']),
  reviewId: yup.string().trim().required(),
  content: yup.string().trim().required().min(1),
  attachedPhotoIds: yup.array().of(yup.string()),
  userId: yup.string(),
  placeId: yup.string(),
})
