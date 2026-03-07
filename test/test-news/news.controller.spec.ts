import { expect } from "chai";
import sinon from "sinon";
import * as controller from "../../src/modules/news/news.controller";
import service from "../../src/modules/news/news.service";
import { INews, NewsParameters } from "../../src/modules/news/news.model";

//Fernando Pacheco que fez esse teste
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

  //Fernando Pacheco que fez esse teste
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

  //Fernando Pacheco que fez esse teste
  it("deve buscar notícias por projeto", async () => {
    const fakeResult = [{ id: 1 }, { id: 2 }];
    req.params = { projectId: "123" };

    sinon.stub(service, "findByProject").resolves(fakeResult as any);

    await controller.findByProject(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(sendStub.calledWith(fakeResult)).to.be.true;
  });

  /* ========================= UPDATE ========================= */

  //Fernando Pacheco que fez esse teste
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

  //Fernando Pacheco fez esse teste
  it("deve chamar service.update uma vez", async () => {
    req.body = {
    newsId: "1",
    description: "nova",
    image: null,
    updateLink: null,
    };

    const updateStub = sinon.stub(service, "update").resolves({ id: 1 } as any);

    await controller.update(req, res);

    expect(updateStub.calledOnce).to.be.true;
  });


  /* ========================= REMOVE ========================= */

  //Fernando Pacheco que fez esse teste
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

  //Fernando Pacheco que fez esse teste
  it("deve buscar todas as news da organização", async () => {
    const allNews = [{ id: 1 }, { id: 2 }];

    res.locals = { organizationID: "org-1" };

    sinon.stub(service, "getAllNewsByOrganization").resolves(allNews as any);

    await controller.getAllNewsByOrg(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(sendStub.calledWith({ news: allNews })).to.be.true;
  });

  /* ======================= ERROR CASE ======================= */

  //Fernando Pacheco que fez esse teste
  it("deve retornar 500 em caso de erro", async () => {
    sinon.stub(service, "findByProject").rejects(new Error("boom"));

    req.params = { projectId: "123" };

    await controller.findByProject(req, res);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(sendStub.called).to.be.true;
  });

  //Fernando Pacheco que fez esse teste
  it("deve retornar lista vazia quando não houver notícias", async () => {
      req.params = { projectId: "123" };

      sinon.stub(service, "findByProject").resolves([] as any);

      await controller.findByProject(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(sendStub.calledWith([])).to.be.true;
  });

  //Fernando Pacheco que fez esse teste
  it("deve retornar 500 se ocorrer erro ao atualizar", async () => {
    req.body = {
    newsId: "1",
    description: "nova",
    };

    sinon.stub(service, "update").rejects(new Error("erro update"));

    await controller.update(req, res);

    expect(statusStub.calledWith(500)).to.be.true;
  });

  //Fernando Pacheco fez esse teste
  it("deve retornar 500 se ocorrer erro ao remover", async () => {
    req.params = { projectId: "123" };
    req.body = { id: 1 };

    sinon.stub(service, "remove").rejects(new Error("erro remove"));

    await controller.remove(req, res);

    expect(statusStub.calledWith(500)).to.be.true;
  });

  //Fernando Pacheco fez esse teste
  it("deve retornar 500 se falhar ao buscar news da organização", async () => {
    res.locals = { organizationID: "org-1" };

    sinon
    .stub(service, "getAllNewsByOrganization")
    .rejects(new Error("erro org"));

    await controller.getAllNewsByOrg(req, res);

    expect(statusStub.calledWith(500)).to.be.true;
  });


//Fernando Pacheco fez esse teste
it("deve passar userId corretamente para o service.save", async () => {
    req.body = {
    description: "teste",
    image: "img.png",
    updateLink: "link",
    };

    req.params = { projectId: "123" };
    res.locals = { userId: "user-1" };

    const saveStub = sinon.stub(service, "save").resolves({ id: 1 } as any);

    await controller.save(req, res);

    const args = saveStub.getCall(0).args;

    expect(args).to.exist;
    expect(saveStub.calledOnce).to.be.true;
});


});
