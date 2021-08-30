Feature: 리뷰 이벤트 처리 [REVIEW, ADD]

Background: 리뷰 이벤트 처리를 위해서는 특정 장소와 유저가 존재해야 함
    Given 아래와 같이 특정 장소가 등록되어 있음
        | placeId                              | country | name | bonusPoint | 
        | 2e4baf1c-5acb-4efb-a1af-eddada31b00f | 호주     | 멜번  | 1          |
    
    And 아래와 같이 특정 유저가 등록되어 있음
        | userId                               | name     | rewardPoint |
        | 3ede0ef2-92b7-4817-a5f3-0c575361f745 | Michael  | 0           |

Rule: 유저가 작성한 글이 특정 장소에 대한 첫번째 리뷰글이면 유저에게 포인트가 부여됨

    Scenario: 사용자가 리뷰를 새로 작성함

        Given 아래 장소에 대한 리뷰글이 존재하지 않음
            | placeId                              |
            | 2e4baf1c-5acb-4efb-a1af-eddada31b00f |

        When 유저가 아래와 같이 리뷰글을 작성함
            | type   | action | reviewId                              | content | attachedPhotoIds                                                                | userId                               | placeId                              |
            | REVIEW | ADD    | 240a0658-dc5f-4878-9831-ebb7b26687772 | 좋아요    | e4d1a64e-a531-46de-88d0-ff0ed70c-c0bb8,afb0cef2-851d-4a50-bb07-9cc15cbdc332   | 3ede0ef2-92b7-4817-a5f3-0c575361f745 |  2e4baf1c-5acb-4efb-a1af-eddada31b00f|

        Then 유저의 포인트 총점이 아래와 같아짐
            | userId                                | totalPoint |
            | 3ede0ef2-92b7-4817-a5f3-0c575361f745  | 3          |