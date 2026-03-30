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
    
  @objc(initializeIOS:baseUrl:configuration:withResolver:withRejecter:)
  func initializeIOS(
    _ clientId: String,
    baseUrl: String,
    configuration: [String: Any]?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock) -> Void {
      runBlockOnMain {
        var nativeConfiguration: AccountProtection.TSInitSDKConfiguration?
        
        if let config = configuration {
          let enableTrackingBehavioralData = config["enableTrackingBehavioralData"] as? Bool
          let enableLocationEvents = config["enableLocationEvents"] as? Bool
          
          nativeConfiguration = TSInitSDKConfiguration(
            enableTrackingBehavioralData: enableTrackingBehavioralData ?? true,
            enableLocationEvents: enableLocationEvents ?? false
          )
        }
        
        TSAccountProtection.initialize(baseUrl: baseUrl, clientId: clientId, configuration: nativeConfiguration)
        
        resolve(true)
      }
    }
    
    @objc(setAuthenticatedUser:withResolver:withRejecter:)
    func setAuthenticatedUser(userId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !userId.isEmpty else {
            reject("Invalid params provided to .setAuthenticatedUser", nil, nil)
            return
        }
        
        runBlockOnMain {
            TSAccountProtection.setAuthenticatedUser(userId)
            resolve(true)
        }
    }
    
  @objc(triggerAction:options:locationConfig:withResolver:withRejecter:)
  func triggerAction(
    action: String,
    options: [String: Any]? = nil,
    locationConfig: [String: Any]? = nil,
    resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    
    runBlockOnMain { [weak self] in
      
      var transactionOptions: AccountProtection.TSActionEventOptions? = nil
      if let options = options {
        transactionOptions = self?.convertTransactionOptions(options)
        if transactionOptions == nil {
          reject("Invalid options provided to triggerAction", nil, nil)
          return
        }
      }
      
      var nativeLocationConfig: AccountProtection.TSLocationConfig?
      
      if let locationConfig = locationConfig,
         let mode = locationConfig["mode"] as? String {
        
        let validFor = locationConfig["validFor"] as? Int ?? 300
        
        switch mode {
        case "disabled": nativeLocationConfig = .init(mode: .disabled)
        case "default": nativeLocationConfig = .init(mode: .default)
        case "forceCurrent": nativeLocationConfig = .init(mode: .forceCurrent)
        case "forceLastKnown": nativeLocationConfig = .init(mode: .forceLastKnown)
        case "lastKnown": nativeLocationConfig = .init(mode: .lastKnown(validFor: validFor))
        default: nativeLocationConfig = .init(mode: .default)
        }
      }
      
      TSAccountProtection.triggerAction(
        action,
        options: transactionOptions,
        locationConfig: nativeLocationConfig
      ) { results in
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
    
    @objc(getSessionToken:withRejecter:)
    func getSessionToken(
        _ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            runBlockOnMain {
                TSAccountProtection.getSessionToken { results in
                    self.runBlockOnMain {
                        switch results {
                        case .success(let sessionToken):
                            resolve(sessionToken)
                        case .failure(let error):
                            switch error {
                            case .disabled:
                                reject("disabled", "SDK is disabled", nil)
                            case .connectionError:
                                reject("connectionError", "Connection error occurred", nil)
                            case .internalError:
                                reject("internalError", "Internal error occurred", nil)
                            case .notSupportedActionError:
                                reject("notSupportedActionError", "Action not supported", nil)
                            case .initializationError:
                                reject("initializationError", "SDK not initialized", nil)
                            @unknown default:
                                reject("unknown", "Unknown error occurred", nil)
                            }
                        }
                    }
                }
            }
        }
  
  @objc(setLogLevel:withResolver:withRejecter:)
  func setLogLevel(_ logIsEnabled: Bool,
                   resolve: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) -> Void {
    runBlockOnMain {
      TSAccountProtection.setLogLevel(logIsEnabled ? .debug : .off)
      resolve(true)
    }
  }
  
  @objc(logPageLoad:withResolver:withRejecter:)
  func logPageLoad(_ pageName: String,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) -> Void {
    runBlockOnMain {
      do {
        try TSAccountProtection.logPageLoad(pageName)
        resolve(true)
      } catch {
        reject("TsAccountprotectionModule", "Error when calling initializeSDKIOS", error)
      }
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
