const RequestCode = {
	
	GetDappList: 50,
	GetDappDetail:51,//dapp详情
	GetConfig: 52, //APP配置文件
	GetContract: 53, //代币列表
	
	GetAssetPrice: 64, //获得币价行情
	GetDefi:65,//defi价格
	GetCommonConfig: 66,//共用配置文件(汇率)
	
	Transfer: 71, // 转账接口
	GetTransferList: 72, // 查询转账记录接口
	
	SendTransaction: 90, //
	GetBalance: 91, //
	PrivateWallter: 92, //
	MnemonicWallter: 93, //
	GetWalletValidateAddress: 94, //
	GetFilGasPrice: 95,//获取FIL矿工费
}

export default RequestCode
