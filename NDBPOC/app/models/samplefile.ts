﻿export interface ISampleFile {
    FID: number,
    CID: number,
    Cname: string,
    Fname: string,
    ShareType: string,
    OfferCode: string,
    ApprovalStatus: string,
    ApprovalComment: string,
    FileStorage: string,
    ChequeOption: string,
    Description: string,
    isPrintFirstRecord: boolean,
    isPrintFirstOK: boolean,
    isPrintAll: boolean,
    CreatedBy: string, 
    FILEADD: File,
    FilePath: string,
    ProofComment: string,
    ProofAuthor: string,
    //ProofTime: string,
    EvidenceFilePath: string
    ActualFilePath: string,
    ActualFileComment: string,
    //ActualFileAuthor: string,
    //ActualFileTime:string
}