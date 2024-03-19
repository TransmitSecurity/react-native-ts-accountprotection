import AccountProtection

@objc(TsAccountprotection)
class TsAccountprotection: NSObject {
    
    private let kTag = "TSAccountprotection"
    
    @objc(initialize:baseUrl:withResolver:withRejecter:)
    func initialize(
        _ clientId: String,
        baseUrl: String,
        resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            
            guard !clientId.isEmpty, !baseUrl.isEmpty else {
                reject("Invalid params provided to .initialize", nil, nil)
                return
            }
            
            runBlockOnMain {
                TSAccountProtection.initialize(baseUrl: baseUrl, clientId: clientId)
                resolve(true)
            }
        }
    
    
    // MARK: - Threading
    
    private func runBlockOnMain(_ block: @escaping () -> Void) {
        DispatchQueue.main.async {
            block()
        }
    }
}
