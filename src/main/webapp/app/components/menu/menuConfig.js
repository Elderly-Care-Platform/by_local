var BY = BY || {};
BY.config = BY.config || {};
BY.config.menu = BY.config.menu || {};


BY.config.menu.modules = {
    'discuss': {
        'moduleId': 0,
        'baseUrl': '#!/communities'
    },
    'service': {
        'moduleId': 1,
        'baseUrl': '#!/directory'
    },
    'housing': {
        'moduleId': 2,
        'baseUrl': '#!/senior-living'
    },
    'product': {
        'moduleId': 3,
        'baseUrl': '#!/shop'
    }
}

BY.config.menu.seniorLiving = {
    'id': '55bcadaee4b08970a736784c'
}

BY.config.menu.moduleConfig = {
    '0': {
        'baseUrl': '#!/communities',
        'module': 'discuss',
        'defaultType': 'all'
    },
    '1': {
        'baseUrl': '#!/directory',
        'module': 'service',
        'defaultType': 'all'
    },
    '2': {
        'baseUrl': '#!/senior-living',
        'module': 'housing',
        'defaultType': 'all'
    },
    '3': {
        'baseUrl': '#!/shop',
        'module': 'product',
        'defaultType': ''
    }
}

BY.config.menu.reveiwsMenuConfig = {
    'service_review': {
        'id': '564b04983b82f7f39e132749',
        'tag': '55befec6e4b07cedaa267825',
        'menuName': 'Overviews & reviews'
    },
    'housing_review': {
        'id': '564b04983b82f7f39e132749',
        'tag': '55beff0ee4b07cedaa267829',
        'menuName': 'Overviews & reviews'
    },
    'product_review': {
        'id': '564b33583b82f7f39e13274a',
        'tag': '55beff3ae4b07cedaa26782d',
        'menuName': 'PRODUCTS_REVIEWS'
    }
}

BY.config.menu.home = {
    '564071623e60f5b66f62df27': {
        'orderId': '0',
        'name': 'Communities',
        'desc1': 'Get support. Ask questions.',
        'desc2': 'Share experiences ',
        'imageSmall': 'assets/img/home/share_btn.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '56406cd03e60f5b66f62df26': {
        'orderId': '1',
        'name': 'Directory',
        'desc1': 'services for seniors',
        'desc2': ' senior living facilities',
        'imageSmall': 'assets/img/home/directory_btn.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '55bcad7be4b08970a736784b': {
        'orderId': '2',
        'name': 'Shop',
        'desc1': ' Improving lives:',
        'desc2': 'products for seniors ',
        'imageSmall': 'assets/img/home/shop_btn.png?versionTimeStamp=%PROJECT_VERSION%'
    }
}

BY.config.menu.homeIcon = {
    '564072883e60f5b66f62df2d': {
        'name': 'caring for parents',
        'image': 'assets/img/home/caring-for-parents.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '564072373e60f5b66f62df2b': {
        'name': 'beautiful ageing',
        'image': 'assets/img/home/beautiful-ageing.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '5640726c3e60f5b66f62df2c': {
        'name': 'active leisure',
        'image': 'assets/img/home/active-leisure.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '55befb69e4b07cedaa26780d': {
        'name': 'caregivers and nurses',
        'image': 'assets/img/home/caregivers-and-nurses.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '55befb86e4b07cedaa26780e': {
        'name': 'physiotherapy',
        'image': 'assets/img/home/physiotherapy.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '55befc45e4b07cedaa26781a': {
        'name': 'home diagnostics',
        'image': 'assets/img/home/home-diagnostics.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '10201': {
        'name': 'diabetes',
        'image': 'assets/img/home/diabetes.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '10203': {
        'name': 'heart and Blood Pressure',
        'image': 'assets/img/home/heart-blood-pressure.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '10208': {
        'name': 'stroke Paralytic',
        'image': 'assets/img/home/stroke-paralytic.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '10450': {
        'name': 'respiratory',
        'image': 'assets/img/home/respiratory.png?versionTimeStamp=%PROJECT_VERSION%'
    }
}

BY.config.menu.leafProduct = {
    '10201': {
        'id': 10201
    },
    '10203': {
        'id': 10203
    },
    '10208': {
        'id': 10208
    },
    '10450': {
        'id': 10450
    }
}

BY.config.menu.community = {
    '564071623e60f5b66f62df27':{
        'name': 'Communities',
        'menuIconImageDesktop': '',
        'menuIconImageMobile': '',
        'desc': '',
        'curator': [
            {
                'url': '#!/users/elsie?profileId=568f08cfe4b00f4b07a43ee5',
                'name': 'Elsie',
                'desg': 'Elderly care expert',
                'image': 'assets/img/community/elsie.jpg?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '55bcae5ee4b08970a736784e': {
        'name': 'Alzheimer’s & Mental Disorders',
        'menuIconImageDesktop': 'assets/img/community/desktop/alzheimers-mental-decay.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/alzheimers-mental-decay.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Caring for elders with memory loss, Alzheimer’s, depression, loneliness, insecurity, and other mental conditions.',
        'curator': [
            {
                'url': '#!/users/lohith?profileId=5653f14ee4b082a5437d1d1b',
                'name': 'Dr. Lohith',
                'desg': 'Physician',
                'image': 'assets/img/home/Lohith.png?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '55bcaef5e4b08970a736784f': {
        'name': 'Parkinson’s',
        'menuIconImageDesktop': 'assets/img/community/desktop/parkinsons.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/parkinsons.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Caring for elders with Parkinson’s and related issues of shaking, shivering, and balance problems.'
    },
    '55befbd8e4b07cedaa267813': {
        'name': 'Stroke / Bedridden',
        'menuIconImageDesktop': 'assets/img/community/desktop/stroke-bedridden.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/stroke-bedridden.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Caring for bedridden elders affected by stroke, paralysis, and other problems.',
        'curator': [
            {
                'url': '#!/users/elsie?profileId=568f08cfe4b00f4b07a43ee5',
                'name': 'Elsie',
                'desg': 'Elderly care expert',
                'image': 'assets/img/community/elsie.jpg?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '55befc42e4b07cedaa267819': {
        'name': 'Incontinence / Personal Hygiene',
        'menuIconImageDesktop': 'assets/img/community/desktop/incontinence-personal-hygiene.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/incontinence-personal-hygiene.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Caring for elders with incontinence (bedwetting) and other personal hygiene problems.',
        'curator': [
            {
                'url': '#!/users/elsie?profileId=568f08cfe4b00f4b07a43ee5',
                'name': 'Elsie',
                'desg': 'Elderly care expert',
                'image': 'assets/img/community/elsie.jpg?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '55befbf1e4b07cedaa267814': {
        'name': 'vision-hearing-loss',
        'menuIconImageDesktop': 'assets/img/community/desktop/vision-hearing-loss.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/vision-hearing-loss.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'assets/img/community/mobile/vision-hearing-loss.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '56407c073e60f5b66f62df35': {
        'name': 'Joints & Bones Problems',
        'menuIconImageDesktop': 'assets/img/community/desktop/joints-bones-issues.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/joints-bones-issues.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Caring for elders with arthritis, osteoporosis, muscle degradation, broken hips, and chronic joints or bones pains.',
        'curator': [
            {
                'url': '#!/users/elsie?profileId=568f08cfe4b00f4b07a43ee5',
                'name': 'Elsie',
                'desg': 'Elderly care expert',
                'image': 'assets/img/community/elsie.jpg?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '55befc97e4b07cedaa26781c': {
        'name': 'Cancer',
        'menuIconImageDesktop': 'assets/img/community/desktop/cancer.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/cancer.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Coping with cancer – survivors’ stories, treatment tips and more.  ',
        'desc1': 'In cooperation with the Indian Cancer Society, Karnataka branch',
        'curator': [
            {
                'url': '#!/users/ritu-sharma?profileId=565d7bc5e4b088c160fd90c2',
                'name': 'Ms. Ritu Sharma',
                'desg': 'Counsellor',
                'image': 'assets/img/community/Ritu_sharma.jpg?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '55befc2ce4b07cedaa267818': {
        'name': 'Diabetes',
        'menuIconImageDesktop': 'assets/img/community/desktop/diabetes.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/diabetes.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Coping with blood sugar problems – everything from symptoms to recipes!'
    },
    '55befc86e4b07cedaa26781b': {
        'name': 'Blood Pressure & Heart Problems',
        'menuIconImageDesktop': 'assets/img/community/desktop/blood-pressure-heart-issues.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/blood-pressure-heart-issues.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Coping with high blood pressure and heart conditions.'
    },
    '55befdfbe4b07cedaa267820': {
        'name': 'sleep disorders',
        'menuIconImageDesktop': 'assets/img/community/desktop/sleep-disorders.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/sleep-disorders.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'assets/img/community/mobile/sleep-disorders.png?versionTimeStamp=%PROJECT_VERSION%'
    },
    '55befe3be4b07cedaa267823': {
        'name': 'Other Health Issues',
        'menuIconImageDesktop': 'assets/img/community/desktop/other.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/other.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Caring for elders with other chronic conditions such as sleep disorders,  respiratory  and other problems'
    },
    '55bcac92e4b08970a7367848': {
        'name': 'Family Relationships',
        'menuIconImageDesktop': 'assets/img/community/desktop/relation.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/relation.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'All about relationships in families with aging parents – the good and the not-so-good.'
    },
    '5645fc4a3e60e958ec2d3d30': {
        'name': 'NRIs / Remote Care',
        'menuIconImageDesktop': 'assets/img/community/desktop/wellness.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/wellness.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'How to take better care of our parents, while living in another city - or overseas.'
    },
    '55bca92ae4b08970a7367842': {
        'name': 'Mobility & Falls',
        'menuIconImageDesktop': 'assets/img/community/desktop/mobility-falls.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/mobility-falls.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Preventing elders from falling. Assisting with moving around.'
    },
    '56407d743e60f5b66f62df36': {
        'name': 'Senior-Friendly Home',
        'menuIconImageDesktop': 'assets/img/community/desktop/senior-friendly-home.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/senior-friendly-home.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'How to make your home a better and safer place for seniors.'
    },
    '55bca7b8e4b08970a736783c': {
        'name': 'Caretakers Challenges',
        'menuIconImageDesktop': 'assets/img/community/desktop/caregivers-challenges.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/caregivers-challenges.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Talking about  challenges of caring for elders: caregiving stories, problems, caregiver burnout, and more.'
    },
    '55bca766e4b08970a736783b': {
        'name': 'Beautiful Lives',
        'menuIconImageDesktop': 'assets/img/community/desktop/beautiful-lives.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/beautiful-lives.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Stories about your parents and grandparents - celebrating lives well lived.',
        'askEditor': false
    },
    '55bca819e4b08970a736783e': {
        'name': 'Challenges Of Ageing',
        'menuIconImageDesktop': 'assets/img/community/desktop/challenges-of-ageing.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/challenges-of-ageing.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'How does aging affect you… or does it really? Questioning stigmas and stereotypes – redefining aging.'
    },
    '5645fe1c3e60e958ec2d3d31': {
        'name': 'Legal & Finance',
        'menuIconImageDesktop': 'assets/img/community/desktop/legal_gray.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/legal_gray.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'How to write a proper will? What is a living will? What are senior citizens’ rights, and how to benefit from them. And more !',
        'curator': [
            {
                'url': '#!/users/rukmani-menon?profileId=5653ed92e4b082a5437d1d14',
                'name': 'Rukmani',
                'desg': 'Advocate',
                'image': 'assets/img/home/rukmani.png?versionTimeStamp=%PROJECT_VERSION%'
            }
        ]
    },
    '5640746b3e60f5b66f62df31': {
        'name': 'Anti-aging Research',
        'menuIconImageDesktop': 'assets/img/community/desktop/scientific-breakthroughs.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/scientific-breakthroughs.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Do you want to live longer - much longer? Read about scientific breakthroughs in anti-aging, longevity, and… immortality!'
    },
    '55cc847be4b0083957500663': {
        'name': 'Yoga & Fitness',
        'menuIconImageDesktop': 'assets/img/community/desktop/yoga-fitness.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/yoga-fitness.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Staying fit, active, calm, and good-looking  – at any age!'
    },
    '55bcac54e4b08970a7367846': {
        'name': 'Nutrition',
        'menuIconImageDesktop': 'assets/img/community/desktop/food-nutrition.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/food-nutrition.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'What  food should a diabetic  avoid? What is a heart healthy diet? Food that keeps us younger, for longer.'
    },
    '5649bc993b82e3a4e249dadd': {
        'name': 'Beautiful ageing other',
        'menuIconImageDesktop': 'assets/img/community/desktop/other.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/other.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': '',
        'askEditor': false
    },
    '55cc8418e4b0083957500660': {
        'name': 'Photography',
        'menuIconImageDesktop': 'assets/img/community/desktop/photography.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/photography.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Photography',
        'askEditor': false
    },
    '55cc8440e4b0083957500661': {
        'name': 'Cooking & Recipes',
        'menuIconImageDesktop': 'assets/img/community/desktop/cooking-recipes.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/cooking-recipes.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Cooking & Recipes',
        'askEditor': false
    },
    '55cc845ce4b0083957500662': {
        'name': 'Painting & Drawing',
        'menuIconImageDesktop': 'assets/img/community/desktop/painting-drawing.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/painting-drawing.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Painting & Drawing',
        'askEditor': false
    },
    '55cc860be4b008395750066f': {
        'name': 'Creative Writing',
        'menuIconImageDesktop': 'assets/img/community/desktop/creative-writing.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/creative-writing.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Creative Writing',
        'askEditor': false
    },
    '564076aa3e60f5b66f62df33': {
        'name': 'Travel & Pilgrimages',
        'menuIconImageDesktop': 'assets/img/community/desktop/tourism-pilgrimages.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/tourism-pilgrimages.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Travel & Pilgrimages',
        'askEditor': false
    },
    '564083353e60f5b66f62df39': {
        'name': 'Active LeisureOther',
        'menuIconImageDesktop': 'assets/img/community/desktop/other.png?versionTimeStamp=%PROJECT_VERSION%',
        'menuIconImageMobile': 'assets/img/community/mobile/other.png?versionTimeStamp=%PROJECT_VERSION%',
        'desc': 'Other',
        'askEditor': false
    },
    '564072883e60f5b66f62df2d': {
        'name': 'Caring for parents',
        'menuIconImageDesktop': '',
        'menuIconImageMobile': '',
        'desc': 'Taking care of aging parents. Sharing questions,  tips, stories,  diaries  – and more.'
    },
    '564072373e60f5b66f62df2b': {
        'name': 'Beautiful ageing',
        'menuIconImageDesktop': '',
        'menuIconImageMobile': '',
        'desc': 'Challenging stigmas of aging. Living longer – and happier. Celebrating lives.'
    },
    '5640726c3e60f5b66f62df2c': {
        'name': 'Active leisure',
        'menuIconImageDesktop': '',
        'menuIconImageMobile': '',
        'desc': 'Activity and creativity – from cooking to painting, from photography to travel. Join us and show your talent!',
        'askEditor': false
    }
}



