import AccountProtection

@objc(TsAccountprotection)
class TsAccountprotection: NSObject {
    
    private let kTag = "TSAccountprotection"
    
    @objc(initializeSDKIOS:withRejecter:)
    func initializeSDKIOS(
        _ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            runBlockOnMain {
                do {
                    try TSAccountProtection.initializeSDK()
                    resolve(true)
                } catch {
                    reject("TsAccountprotectionModule", "Error when calling initializeSDKIOS", error)
                }
            }
        }
    
    @objc(initializeIOS:baseUrl:configurations:withResolver:withRejecter:)
    func initializeIOS(
      _ clientId: String, baseUrl: String, configurations: [String: Any]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            runBlockOnMain {
              var config: AccountProtection.TSInitSDKConfiguration?
              if let configurations = configurations {
                let enableTrackingBehavioralData = configurations["enableTrackingBehavioralData"] as? Bool ?? false
                let enableLocationEvents = configurations["enableLocationEvents"] as? Bool ?? false
                
                config = AccountProtection.TSInitSDKConfiguration(
                  enableTrackingBehavioralData: enableTrackingBehavioralData,
                  enableLocationEvents: enableLocationEvents
                )
              }
              
                if baseUrl.isEmpty {
                    TSAccountProtection.initialize(clientId: clientId, configuration: config)
                } else {
                    TSAccountProtection.initialize(baseUrl: baseUrl, clientId: clientId, configuration: config)
                }
                
                resolve(true)
            }
        }
    
    @objc(setUserId:withResolver:withRejecter:)
    func setUserId(userId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !userId.isEmpty else {
            reject("Invalid params provided to .setUserId", nil, nil)
            return
        }
        
        runBlockOnMain {
            TSAccountProtection.setUserId(userId)
            resolve(true)
        }
    }
    
    @objc(triggerAction:options:withResolver:withRejecter:)
    func triggerAction(action: String, options: [String: Any]? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        
        runBlockOnMain { [weak self] in
            
            var transactionOptions: AccountProtection.TSActionEventOptions? = nil
            if let options = options {
                transactionOptions = self?.convertTransactionOptions(options)
                if transactionOptions == nil {
                    reject("Invalid options provided to triggerAction", nil, nil)
                    return
                }
            }
            
            TSAccountProtection.triggerAction(action, options: transactionOptions) { results in
                self?.runBlockOnMain {
                    switch results {
                    case .success(let response):
                        let actionToken: String = response.actionToken
                        resolve(["success": true, "actionToken": actionToken])
                    case .failure(let error):
                        switch error {
                        case .disabled:
                            reject("disabled", nil, nil)
                        case .connectionError:
                            reject("connectionError", nil, nil)
                        case .internalError:
                            reject("internalError", nil, nil)
                        case .notSupportedActionError:
                            reject("notSupportedActionError", nil, nil)
                        case .initializationError:
                            reject("initializationError", nil, nil)
                        @unknown default:
                            reject("unknown", nil, nil)
                        }
                    }
                }
            }
        }
    }
    
    @objc(clearUser:withRejecter:)
    func clearUser(
        _ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            runBlockOnMain {
                TSAccountProtection.clearUser()
                resolve(true)
            }
        }
  
  @objc(setLogLevel:withResolver:withRejecter:)
  func setLogLevel(_ logIsEnabled: Bool,
                   resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) -> Void {
    runBlockOnMain {
      TSAccountProtection.setLogLevel(logIsEnabled ? .debug : .off)
      resolver(true)
    }
  }
    
    // MARK: - Helpers
    
    private func convertTransactionOptions(_ options: [String: Any]) -> AccountProtection.TSActionEventOptions? {
        guard doMandatoryOptionsExist(options) else { return nil }
        
        let correlationId = options["correlationId"] as? String
        let claimUserId = options["claimUserId"] as? String
        let referenceUserId = options["referenceUserId"] as? String
        let transactionData = convertTransactionDataFromOptions(options)
        
        let options = TSActionEventOptions(
            correlationId: correlationId,
            claimUserId: claimUserId,
            referenceUserId: referenceUserId,
            transactionData: transactionData
        )
        
        return options
    }
    
    private func doMandatoryOptionsExist(_ options: [String: Any]) -> Bool {
        guard let data = options["transactionData"] as? [String: Any] else {
            return true // the entire object is really optional
        }
        
        let amount = data["amount"] as? Double
        let currency = data["currency"] as? String
        
        return amount != nil && currency != nil // the only two mandatory items
    }
    
    private func convertTransactionDataFromOptions(_ options: [String: Any]) -> TSTransactionData? {
        guard let data = options["transactionData"] as? [String: Any] else {
            return nil
        }
        
        guard let amount = data["amount"] as? Double,
              let currency = data["currency"] as? String else {
            return nil
        }
        
        let reason = data["reason"] as? String
        let transactionDate = data["transactionDate"] as? Int
        
        var payer: TSTransactionData.Payer?
        var payee: TSTransactionData.Payee?
        
        if let payerData = data["payer"] as? [String: String] {
            payer = TSTransactionData.Payer(
                name: payerData["name"],
                branchIdentifier: payerData["branchIdentifier"],
                accountNumber: payerData["accountNumber"]
            )
        }
        
        if let payeeData = data["payee"] as? [String: String] {
            payee = TSTransactionData.Payee(
                name: payeeData["name"],
                bankIdentifier: payeeData["bankIdentifier"],
                branchIdentifier: payeeData["branchIdentifier"],
                accountNumber: payeeData["accountNumber"]
            )
        }

        return TSTransactionData(
            amount: amount,
            currency: currency,
            reason: reason,
            transactionDate: (transactionDate != nil) ? Int64(transactionDate!) : nil,
            payer: payer,
            payee: payee
        )
    }
    
    // MARK: - Threading
    
    private func runBlockOnMain(_ block: @escaping () -> Void) {
        DispatchQueue.main.async {
            block()
        }
    }
}
