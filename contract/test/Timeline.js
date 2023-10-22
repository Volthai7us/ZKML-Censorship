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
            proof: '0x29384da5294965083fd63c72ab46c840b16d70aa22ec68465b12a2e03c1d645d26d603b7e4d4a41b9144124970c9ad4d155b7ac1f580e4ade02e161791e2690210c54fc46f0802d67c419101a19fcb019ca1059a20db04f0f38e6cea7e6624c41645fcd0181776925d21c1e58db33fc88a4a3e76a9c30722187fa1d8ea494ca3097a205b660a3813d414fc5cdb67a40d536c4d6ec78f7db8480468f746cfe87511fd85b85efa06eca0c95c8cb26e7681cc00609d6912a023a7e4fa06085d27c01c18165f215da4e340f7bf6841c234a6297d6744153792920bbe6f3a898c39801bcdef1654e72f404298f4ba0f459565f357471b6fe87eaa8d1c64d26c360b81182bfa8940302abfb2c2e64fdadb2708e9858ae7d135190fd29b0afa4696e6901720d422e57b446b7229a852072d536b3956df5963f354262f31db0a1a0fdbc4096be5f6da1a6356237f8d4e2c52a08cfc844f49fad78395e03de3b92ed67afc2c5e0efd3f1133dab02bc2ae92e210ba1a7011943a9aa4f7a5ab483b622fe75d18802636695fc0a3e2d09c39533eead2ec59f3476ad2f82726a5e10febe5948b01f6df4d844a7c3f09c89057d4bd0a39ea8e13f31e6122e6515e83c4ab51513d2df6ed8e39ac17f77636b92516938fdb2d2020f05c8057f153fe69535c7822201c6f915ac747567adf3c78fffbd35cff2df72124b22cd9731f5607a56e75e405215fbb34b0e10a0ed6b7cc13a5599133afead1c6b9f187f7af54b9e2f878875e1ca8c89badd7ead5c37ec5e1bd488fe5dd1c5146bec6299c3d0be9ec1a4162dd1b8ad05dd36081e4c6ae1fb48c75cec00b88fc9d87c62a01fb676d6330ee5c211b8cc4749d71631966491db7f81ed2f424f46e3b18d3bec0e28931312ed01bc9098127578139d2d30b86cff34db4354c6de30a038974971f5d08048988970c7e0c0e93042d996fb84082b50bb2f25c64b391ff6071287c76f193049064eb777e25bf29ecfc8eae476599cd31597bd9012dadb5a53715ccec825c35ef89d19439066c01322792af10e52e5859e480e08f9b1e1fc9bc8d460cd5abe9b7416b256022601e8831807bd484860c8ed8b3a0dab84c771db85685fea6b32d6d7b74689d0f6b81083ce1b496909d4eb54f76f5cd0a86f735a958406c151b8ec293e8f09a0c4da9ccad73f61d02a7388dbeb04412f001e0154a536593a19d31fd01da89462223c4393bf1cdaa6adb17853cf1111dfd3ba3469d67aaddd8767edd2f2e2e8426fa53cf6a31ce0b73952a077196bc611ad8027dc4124b1e981c2c2132280cb50b1b90db476549904195094d6fbc6230cd52413e04248429556de445ba8142802feccea115a12f7ef766c9e8b29770dab7f5b04b483b7d8a48f798b826df60fc24af72b5494083512623c04856234e3da8b453ec47ea8e4b6a7525a96285541623719d130f33549cb13fefd72b28b14330cbcfa8129fc3f30cb784235c3be4bd2c4e3ad61b8c8b210c9f568c4c28fa331efdc24e55179a2580d15fa1184b0c2101369f12bd44aad1a333139f81ac30c8403b64b1ba35f888a27d392a2c3606c718899f5f9c9781c6280c79a2c10cd17d46b6a52f6d7d674209b2d23adcd061640e20ef2621718856dabc88150e606a766c54600f1f860f244a31b0e8045dc0662b60cc8b3352ea94bbb1ae2733e53ec69350f7ca1f0e2f9e833e7e7ccaf6f2fd263ac784eabb99478ff7d99820590ec12dcee5a10744d4d8bdc05a13860a291a07cf7096fb114c7b72d6b05e78a78adf39e90eafb45862868c205cf93a9fa0ac22ab7f160008cc1ec62262d0c7b3e7a833598f6b6b211bf899c8f4a81473bc420423bed745dc1305f0829c4462a2992f713f4436a39ece67fc46e1875fbdd6fb0e42966047db13a8e0be2378eaf37676e7a1df2a0a8b94bbd2b0cc12d2d6e35b29b4f6934eb358b8677cd0f76f5be0e9b705524aab7fc4a2edb2ac1fbe9e9951292659eb57d37d6ef615dc922dd8c1a01841707584faf64f112ebb560fd67b6d2897bd4360f3a22584aee82cec55a256797d8ea05e7627fb34aaca8c610e5d892809209b6a13c6dc1347f3c7aad2830cdab9accb37f159a75826d9c2b2463fa52a43933b45933401d8e3c55cb0df003355c9341fd20492f6ca369ce96d66b7352d6a887f65146ca1d9dd8b439c300778b87318b376a5fc6ea3d7995b94182e03243c80e5bd6b6051acd2ca5c0154d2ce63185915830ce1c49b9e0cd693e9b3592e0e5896039ae6630e0844dc5ed9d07ef6575df226e60f96cc1c14e4349eb027099373e7fb6d0b1db190e2633a21eaf179ee0560909f01fbc4bdd377e920faca058ede9b55f513c114338b85a61178848ca4c3208f12e7bcc11cd03a40500dee14fcf58b5d7b8134d0d269f1df9df766a5f92c8f65ab3420cd72b2ea5ef40daf2a43dabd633c55ff5727cf692d4096420a17df3f4ddd627d7f3777b19b2a6fa514cb333c10316f225d87115d98a7eb25e337714a759002a983062283e3f30a4d1f93ac7f595bb25243ab345456891631d8992c781516254d1579da460e97786019ac354ca0c339d5402cddadde7835eef22ca32c4dfed1a8e0a96a2f822bdde3181e1ffce60cd2ec00670c469952fe46df770fdf04df524fc773712d224894a1152b1839c02a69be23d638553caac858c5676977644c5b88a53d3a6cccc2fe7f1af70b72cd9cbfe6cb84182b8c83cb1299345af20c222c8acdffd3c231d33e5f20c2feabdb0f160f7331f801dc5ccdcc6d014c6cb3f7fd8cf6c26d1796e37e3f268ef1e4e8816c381adfd7d82c35d08640ce3de75bcdce8f1f85066cfbf3be1f23afcbb8f780243b3ffea805ad1236f6ce178e2f5a1e616baa85b1bd8321db362ea3c3ecd7d60a5b268d543386fd67a5a24f1ef1657b5224dd33a12458bdae031d7466ff7c23471a356ed5b48024b51a2fd8293b2caf07140ff72f2f1017aad200466d2b47c5f178bb991f1d7c60514b1d0f5f5dbd88c87408c3cdf711fb62f6',
            input: [532, 10306, 1195, 11580, 3120, 12678, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            hash: "0x249c167b37ca834ab55279ae4468fa72833f64515031bf021ba87208b7623a44",
            positive: 1
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