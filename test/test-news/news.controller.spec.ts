import { expect } from "chai";
import sinon from "sinon";
import * as controller from "../../src/modules/news/news.controller";
import service from "../../src/modules/news/news.service";

describe("News Controller", () => {
  let req: any;
  let res: any;
  let statusStub: sinon.SinonStub;
  let sendStub: sinon.SinonStub;

  beforeEach(() => {
    sendStub = sinon.stub();
    statusStub = sinon.stub().returns({ send: sendStub });

    req = {
      body: {},
      params: {},
    };

    res = {
      locals: {},
      status: statusStub,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  /* ========================= SAVE ========================= */

  it("deve salvar uma news e retornar 201", async () => {
    const fakeNews = { id: 1, description: "teste" };

    req.body = {
      description: "teste",
      image: "img.png",
      updateLink: "link",
    };
    req.params = { projectId: "123" };
    res.locals = { userId: "user-1" };

    const saveStub = sinon.stub(service, "save").resolves(fakeNews as any);

    await controller.save(req, res);

    expect(saveStub.calledOnce).to.be.true;
    expect(statusStub.calledWith(201)).to.be.true;
    expect(sendStub.calledWith({ news: fakeNews })).to.be.true;
  });

  /* ====================== FIND BY PROJECT ====================== */

  it("deve buscar notícias por projeto", async () => {
    const fakeResult = [{ id: 1 }, { id: 2 }];
    req.params = { projectId: "123" };

    sinon.stub(service, "findByProject").resolves(fakeResult as any);

    await controller.findByProject(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(sendStub.calledWith(fakeResult)).to.be.true;
  });

  /* ========================= UPDATE ========================= */

  it("deve atualizar uma news", async () => {
    const updated = { id: 1, description: "nova" };

    req.body = {
      newsId: "1",
      description: "nova",
      image: null,
      updateLink: null,
    };

    sinon.stub(service, "update").resolves(updated as any);

    await controller.update(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(
      sendStub.calledWith({
        news: updated,
        message: "Atualização do projeto realizada com sucesso!",
      }),
    ).to.be.true;
  });

  /* ========================= REMOVE ========================= */

  it("deve remover uma news", async () => {
    const removed = { id: 1 };

    req.params = { projectId: "123" };
    req.body = { id: 1 };

    sinon.stub(service, "remove").resolves(removed as any);

    await controller.remove(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(
      sendStub.calledWith({
        news: removed,
        message: "Atualização do projeto removida com sucesso!",
      }),
    ).to.be.true;
  });

  /* ==================== GET ALL BY ORG ==================== */

  it("deve buscar todas as news da organização", async () => {
    const allNews = [{ id: 1 }, { id: 2 }];

    res.locals = { organizationID: "org-1" };

    sinon.stub(service, "getAllNewsByOrganization").resolves(allNews as any);

    await controller.getAllNewsByOrg(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(sendStub.calledWith({ news: allNews })).to.be.true;
  });

  /* ======================= ERROR CASE ======================= */

  it("deve retornar 500 em caso de erro", async () => {
    sinon.stub(service, "findByProject").rejects(new Error("boom"));

    req.params = { projectId: "123" };

    await controller.findByProject(req, res);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(sendStub.called).to.be.true;
  });
});
