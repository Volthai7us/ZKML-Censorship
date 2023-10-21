const {expect} = require("chai");
const {ethers} = require("hardhat");
const hre = require("hardhat");

async function deployVerifier() {
    const UltraVerifier = await hre.ethers.getContractFactory("UltraVerifier");
    const ultraVerifier = await UltraVerifier.deploy();
    await ultraVerifier.deployed();

    return ultraVerifier.address
}

async function deployTimeline({
                                  verifierAddress
                              }) {
    const timeline = await ethers.deployContract("Timeline", [verifierAddress]);
    await timeline.deployTransaction.wait()

    console.log(timeline.address)
    return timeline
}

async function newPost({
                           timeline,
                           proof,
                           input,
                           hash,
                           positive,
                       }) {

    const public_inputs = [
        ...input.map(x => ethers.utils.hexZeroPad(ethers.utils.hexlify(x), 32)),
        ethers.utils.hexZeroPad(ethers.utils.hexlify(positive), 32),
        hash,
    ]

    await timeline.createPost(
        proof,
        public_inputs
    )
}

async function newProfile({
                              timeline,
                              username,
                              bio
                          }) {
    await timeline.setUserProfile(username, bio)
}

async function likePost({
                            timeline,
                            postID
                        }) {
    await timeline.likePost(postID)
}

describe("Timeline contract", function () {
    it("Deployment", async function () {
        const [owner] = await ethers.getSigners();

        const verifierAddress = await deployVerifier()
        const timeline = await deployTimeline({
            verifierAddress: verifierAddress
        })

        const postCount = await timeline.postsCount()
        expect(postCount).to.equal(0);
    });

    // it("Profile", async function () {
    //     const verifierAddress = await deployVerifier()
    //     const timeline = await deployTimeline({
    //         verifierAddress: verifierAddress
    //     })
    //
    //     await newProfile({
    //         timeline,
    //         username: "Volthai7us",
    //         bio: "Building this platform"
    //     })
    // })

    it("Verify", async function () {
        const verifierAddress = await deployVerifier()
        const timeline = await deployTimeline({
            verifierAddress: verifierAddress
        })

        await newProfile({
            timeline,
            username: "Volthai7us",
            bio: "Building this platform"
        })

        await newPost({
            timeline: timeline,
            proof: '0x1395173a19f2db1761db51b38fe64d45180ec3573a791ae36ceadf8a66e1b6732ea63891826710ef4f8375ac27afd8a0c12af4d077e7955a022dade1d9b4d37e25dfc4494170df89ac2e1af219f5140385816e64ba2fec6c4f4e6e163a64d69621b7278629fcfb64b81a21e3195f7b87db362a0431a89a7de22eb7af4f19d7640eac42a6a620f61d8955919e1b40c7867c4669882fab09187131c605af135a4c2e5747a3d67148e8668d906d1b3d3045be9e81234e61df8fee26acdd5383308c099000f3de4b2c47057129744705759ea95f2eaf483259f5c86f783990307b3d2240aee08cac0b7016487ce4b32b44d6b46821a5ab3b1831b45563eec2dd62251db391663fa6b8c96747b331e56082f2882829bde725f65506904ea80ef6ba7b226ac357cd6de3863319a53072252d61c71ce35e70304cb0777047aeece9647e053af1c5ec17291a2ff4eea768d352869f8455b723eb3d5275ca6d1a8ba334a617e59b9087cf65e4272a171494b3ba7aaf89ba27945a7f18afe6592a0c5121622f4314933c29c5f9c4486c1019d7b82b4e77ccfb561acddc20de1e39165ac74f0135ea868155a784e3388a9ac9a3c7deeeee335cba03d083ae11d5c62263a45413267a0032dce28dbdd731616b4a1c60c323767c0a0a9cef6d6ce1aedf26556f00c1ae45ea44feb3dcff1e2210fbdd428d3744a3e3dbed28f1d92921852dcfa81df8b1286d7e50ab99408ddb76cc2c62f7930bcc4ebae41d6ad7a808af65a5820b6ed3922a0c9b66316fbc4b1cf56440ce15ee9b73e761a9c7c617f38a6d05d6244e78cd60135013b4bff7c72df8e1e097d3bc2f5e4980f34540034c87e0abe717ffc2966c3b1ca71c54800b34fd51ea039a7fbf26c40cf9d30044a9b3cde3892d7cbccf7bb3d23c609ad979615e23176b2d5a81a1158e28280893ca4f925900154c7d3f37c1da978cb9b1c9d4893dc8130ca01ff0c3f55ae1ae0e7ea257e5630318d3265d8bf4f3107d539b9f13930b849e713d255d92dd9a5bd6afa268f9070612bc065b560f1d303942d05c72a0e58a461c3474abe70c59d236ae045858f12a34744abeb3fbfde0025a1d03a907f69d1f832ca042483615cf72da83cfd7be288f21fc8692a0b52a5bfd0c09a4f863dddd478efe51a2a5591635e29afcfee115a8b1898a6d38ae34d7d03186eb9050d074a278eb5987a27466110468f3a6dd159abb9d2b8961d756638f0e82ebe0d62625b4c21cf88dd4022404a235846f0122b828b0203d44ad699e8d47dfd11616456556cd37f0124b7e471a736c52dd7b0de40fe46ad072deb42450dd668564eccbd2fcfea007d813e810c30f25b16b2e1c7f2352a5483d3b4f2e513b0a623316186582f5f6a83bd6947e80f6d72c6364159192f6c98c199610cadb0fbb467c46723fb3f9bbf50c984d9941aefa5f7919107620b28f640e552097ba6ee1f0831506dc847c86ad31c648998416c51fa18b20df64c8efeb5b0f940b6a19ba781acc7200201fd4c5c6eb3f7800ca11e56a6020ea3d1abcf7b05006652812f7e883d6f9732ed117a7eb0a9e25339f7beee8140c881d7d08f19953e9f51c0f66a83c07be453e84f3092d3b1c8d749050cbd1f8094b291a9e73db819ad607d77dd73b7ab9dc90415bf027554835c6e83cb315d005d4a5a5cd16201426bc65cdde90751980b409ff5b85330a79777212d9fcf64b169beea5a0b75907da416be8b0af2dc99c67916cc727255881255ed47b1911a908fc53631e08bdc7d279541de8e4667c1fc3396e3b30cee045e2e82c7735dfb904c4e4898b02feef24fc1219e3a4efb5f9003e8b9ae77f1dcc1c72c0261dbbbc1867bfcbf7bc10c7a292ffce94fddbb1cdd2aa8569636b905b9f51f0e34e1163135b17285374ea3193514e029bfd336297a3d6087a52a320b354f1e55acf9de107c6323266c82ac588fb3267d36b46ccab9ab7ff24b199634c9f42c3cd514864188d7b323a6963b93c803882a589ff7cc74e3f6c90538bb1544d2f856e6d63c22954c4320e0a9cacf0053e9d77a8b82ce301c6d9fbf57dff5bfb1c470f897f2009b7bebf007a3576eb39ff01c846187fd68165feedddffbc1fc71374c0a59a7d276337a5745891fb8dc6720382cde679b81b18da32c917a688d34b961c352d0721fcc88e1ffcb382ee0fc98ae8522b45eff882e67080a914a71812a2a95d759509b07ba608877fbd675174be9ebd57783d9b72e37d3704ef455a3b89eb00102a2fa9a01b9d61800897982466d9b6a8e346c41fefd9cc04f9c9887d34ab51a1471327a343ce153f6f1f2c214c510e77161edc4aff07b4722b3c5d4f2f2bec67560e5afe9acfbed6f3ffe1fdc714a18f986479ea34fee400c3dcc0200440eb808f10fdbe7ed1f565275c7ffa09827819b6fba6c0b65a9f4b1abb750331b4a151e5148759dda0b435d8019c6590cc0925c13d724e4a10445d867aadddb73d0b3ba207dd7f65ac7c453980aa67dbd6645deb850faaa756299451f3a58e87272372891a5174f59867fbef62675d554041006ced82763a2bb52820257124a7f450c75e116c5098b9067102e624c3b2144e758bf076df5f237ce089eecc253a010afd6f21dbf999cbab4ca7f269d455eecab7df9d0fcb127627d7b8fb132a1c832dd61c07ca07ac065530dccc5b72bf11a6a0294d5f6bb8ad049a7be4250ca3779745061080eab82c648fa0d1707298135f66e6efdab0becfb93a1e6d232149bee3e01c1937cdc45273ee64d685727115182da49255f5c4f26dd9c0f62135f006307b3221eeb0d078834d28db9a724a16d0f46234d13acb152279637f1f4a964d7d164814bb8507aaf2ba31ea13741a5d8a7bc07d51f54380f8123f67f10227e19f9f9d183837d2478d1a37b630d1bc7da9f7afd02309cf30e911a19b1ac8e2fa56c9600a5390132cfc790f61633f97147fa3375f37c4c87f49015c9733b81084f644540db2ca1efce356333a0f590454e7cd470be94a2eeddf83628ad3e885a8ad4fed',
            input: [532, 10306, 1195, 11580, 3120, 12678, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                hash: "0x249c167b37ca834ab55279ae4468fa72833f64515031bf021ba87208b7623a44",
            positive: 1
        })

        await newPost({
            timeline: timeline,
            proof: '0x0c1910ac989bf9932a2853770aa5d2fa7e854a7f2d95ed11f24c26944ccb84a0073a0239f403a828038236691077717d14b137d23d2469322276cdaa8d470f35156c2256deea69b83276be5ddc30172da972fc3f3fba3af6bcaa5ac25278f11c075b1705f8c6c45411c410da3b9d8fc972c17953867780a3399e39a6ccbbf264227a0f8bdd140ebd0f50e29ddb22cf217743e9f7784b3b3b69ea0360630438a018f38bbeaa72971b954f988e501a38af42dc3c33634d5eb5783e043339ff7003251af3ed851345edb6cce54adf9e6e8e9da6d18dd8573c3f44bf7ea9367defb21735b4d536ce9b7220021bf9174e80d5893d4ebe3c58257e59ee1aecba4193b82e3a7973e78c0799a867fb1d907cdc92771b386e23455284df94de67ee8e307c1af9144778e12b61e424995b5f898497d19a4a4798fea46a1405d919fbaaf76e1ee35f0ad5ae2bbb76b1645046d8ed40373b2429a4cdf5cf5f671da776b7bd1a2d64d82e6df26d55f2af6991c6c4695070034e097d88e39c44b2567639e49ce508a9cdbcf3ae3b4fcf439ae9cfafe5ac9efe5b4a1e4f579ff3391dfcf22f3c590a47684fba4603b2819a44c90ca83660325ef3d954cf80e3f755ad1f060f87cd008f7571aa6ab3dd0b061af442e816ba2079fab51a7d7d2ee8467a7cd1d4163c2cd2d43b381afd7ed6e708a70c2e91a0bf9c88f275bcd2fc19cc3f08ee7f357d194ca7d8fa7955a6c0a7ad5b007e38b73e5d04935805a7360ae091334cea7b3d210b00182b494d5e85ce40fbaad979e5639da47f25cd414e1ecf325fbc72c8ca040c1cd6cefd78fef30e619c3c7643e2c6a5a30a197838242e3053a9946f1aac282d4db6fa5a643e7274411aea34a37b9794f61258bc77c066ff9b45a070594b304d2e1a82668747c4deb64df76352b136f96f07aa57e0382ac11fdb6219f5ed11be628a7f5bbd9fb397f62b3597bb313e55b3999c49518364d982a6d90a23cc04d2e7b5a4e955aa4c0e5d16a8e552a8dbc9a7b9387323984d06c6e10ed122df269cc3e3bf24030abb459d6de96edb869a435ea42018cd389f272e66f7fd414e09692f7d8f735514f8856a9f9c47c6858cdd157f7c537e90a5b23b6b16a8779a07ee085322aa4767bbaa993e215a92b5e56c19609973bd27fa3a239dc08d0d2000e5541bfcf7163b365893029fbea3cda4216dc69c8530cc4e54324a2595c2dc2c274e906327e9ef463277135837c454f09420351afff2120cad0b26f56618290303789a96fe3b2a1cd27f5792eb7c664cbcfdffcc3ad7a7a322da6e8e3e458318ee7e9a51704ffbc1627464bbed894a8b8040ecdf32da4ce6b65871a37f8d5c1f5f0ffaa7625cac61df5ce36946e4544a54edbfe9a7db178a0923ca35fac5f10dc59d7300de6f2108d2930dff5431d29401df45a8065cf86ac84207922e537b1310ee922a703b80a1e5ce75d5b8558fef284d6d46436e14282e18ec037068990a1725bebc90600379539dca1398198ceffd91b4846a8134015c1a92a7fa32ef0f3e657f710da1b6ef2847d276728f7d3a9bbbee286e9a437163c6ea0882b0ad077d81de9639bd4b1bcf375b463a4358a956d4edb9cf2a89b1f5002d8dad4e622ae8d4aa6d3799b4fc3ba68adeaa4b240c291916a31e7c1299bc0681b6df0f421cc1893355dc1e8f64f5c3fb55d7dc4c3e72f8162f6f147e495901402b0ac89d2ab470fd3c1c0ca89922e93fd17e5dbec0198028c1882fc90b3fc62f48b6a60419e2f89844d5a0a47522a59df014c3bb64ee9e9e30ab8bccee04a8e269db0f261b70dc14f2191a0479666512d415407d5ff5d41cbb588b9745a45678b52b178112b461a638098d0fcf776ddcbea7c5c318cdd431f5fff5771a5ab86cde37af131cf08c4efbdc284f525cab6cf7c912dc64a5796aa8a1f79cea7aa184354201971635f21e276a48b1492cee12474a08469b32a8056c00f5cd4b2b5a79940e60d12428d9e80daa36ca7d5a1356c2f089b91cd93017fe1a11180d121f68b1ba3e3801b7733f12b884b9f936f2e4bd15b2ce764bcfe21679bbd18b16eec3df661b9e0faa5b08f8f872d32d64182938bc3440f7f257f4a892d71c4cfdb3b2fd11f90508430a54412a5a9814ffc8cdcba386d4198c1ff2d9e7da828944958a7662836a1def66de3a586c8038a712e7b57b447f344317eaad3abf1199df93100b8f2d8b02d8f4a80571246a9695671f0d48602727f17ce76bf22132a9f3be73a4c6f0441ca20a92c3719901afe75e3c3d1cfd91f9665287edc1ec2fb0ce0f48366e80160cc3b36408b775257b568ceac084fd113cbfd21fe96199ca9bca9e52675414d21403ac6a85620cf5820d5507493b58eedda21ba12caf268ce83e66601ce67e6c14191b96e2d1d1a73ac8c76c87bccebf114248ba821d8e25fa87446d060c4e2827021ff8f4bdd5d07d067b13a28e65e402e0f061a9d4cabfad43c11f984bfd0220f7a6cb9426add4b188f5b34fc54df1cf074e0d6f370dfe5a3427be790229f5265adbe6abb4c1162001b2a1ba94c9b0cc6104f2327c1b897a915641035700502d516713744add0fe2fe78170443eabf8fb9a96e57e58d7234383f07d98fef8c23a4f309f9bb334491125c4f277205d50126f44588efa8e3233ab3197b6dbb6d1265bef58f83960a70d0f889c3f15b4443f6a279b6aeeccb368302cb5bc8a9a7281804e48ea33a9cb1ae7fa14a3b5d061a60d0ccb8a01a18acac14049cc40d200d65fc60ac913f053a3bc1024f04066ac89716d740d7d6d4def32fa9edbf70982318424fabb0e3977b194819d54e082c9f01452a42c90422551c40e32ebad41128172b4457fd66c45689a6e7af38dcbd371bf66c26aa2bab92fab74a8e0041da2d912906fd89a0f75703e85b8940228a19a43db5b8df72e660231e42b4c35ee01c600fc38fb481e4922b5f8081014017a3c04d7de5b4add36549b9c500d282672f302af52658737060f8d2f8b37bf1aae7fdce853743f76ec258983724cc5b6c',
            input: [3467, 15770, 4295, 4891, 2232, 9011, 8652, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            hash: "0x02720fc8445b8c20c28aa5ba492ab609a001862f295bf6dcf5c76a00f8ff9621",
            positive: 0
        })
    })

    // it("Post", async function () {
    //     const verifierAddress = await deployVerifier()
    //     const timeline = await deployTimeline({
    //         verifierAddress: verifierAddress
    //     })
    //
    //     await newPost({
    //         timeline: timeline,
    //         content: "Selamlar",
    //         proof: 0,
    //         positive: 1
    //     })
    //
    //     await newPost({
    //         timeline: timeline,
    //         content: "Selamlar",
    //         proof: 0,
    //         positive: 1
    //     })
    //
    //     const postCount = await timeline.postsCount()
    //     expect(postCount).to.equal(2);
    // });
    //
    // it("Like", async function () {
    //     const owner = (await ethers.getSigners())[0]
    //
    //     const verifierAddress = await deployVerifier()
    //     const timeline = await deployTimeline({
    //         verifierAddress: verifierAddress
    //     })
    //
    //     timeline.connect(owner)
    //
    //     await newPost({
    //         timeline: timeline,
    //         content: "Selamlar",
    //         proof: 0,
    //         positive: 1
    //     })
    //     await newPost({
    //         timeline: timeline,
    //         content: "Selamlar",
    //         proof: 0,
    //         positive: 1
    //     })
    //
    //     await newPost({
    //         timeline: timeline,
    //         content: "AAAAAAA",
    //         proof: 0,
    //         positive: 0
    //     })
    //     await newPost({
    //         timeline: timeline,
    //         content: "Selamlar",
    //         proof: 0,
    //         positive: 1
    //     })
    //     await newPost({
    //         timeline: timeline,
    //         content: "Kötü cümlelerrr",
    //         proof: 0,
    //         positive: 0
    //     })
    //     await newPost({
    //         timeline: timeline,
    //         content: "Selamlar",
    //         proof: 0,
    //         positive: 1
    //     })
    //
    //     await likePost({
    //         timeline: timeline,
    //         postID: 0
    //     })
    //
    //     const postCount = await timeline.postsCount()
    //     expect(postCount).to.equal(6);
    //
    //     const isLiked = await timeline.isLikedBy(0, owner.address)
    //     expect(isLiked).to.equal(true)
    // });
});